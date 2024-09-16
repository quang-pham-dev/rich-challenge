import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Modules
import { PrismaService } from '@/modules/prisma/prisma.service';
import { UsersService } from '@/modules/users/users.service';

// Constants
import {
  JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRATION,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRATION,
} from '@/constants/jwt.constant';
import { ERRORS_MESSAGE } from '@/constants/errors-message.constant';

// Interfaces
import {
  JwtPayload,
  TokenPayload,
  TokenTypes,
} from '@/interfaces/token-payload.interface';

// Utils
import { logger } from '@/utils/logger';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      // @TODO
      throw new UnauthorizedException(ERRORS_MESSAGE.INVALID_EMAIL_OR_PASSWORD); // Avoid leaking information
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (user && isPasswordValid) {
      return user;
    }

    return null;
  }

  async login(user: User) {
    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
    };
    logger.info(
      `[Sign in]: Sign in process started: ${JSON.stringify(payload)}`,
    );
    try {
      const tokens = await this.generateAuthTokens(payload);
      logger.info(
        `[Sign in]: Sign in process succeeded: ${JSON.stringify(tokens)}`,
      );
      return tokens;
    } catch (error) {
      logger.error(
        `[Sign in]: Sign in process failed: ${JSON.stringify(error)}`,
      );
      throw error;
    }
  }

  async register(user: User) {
    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
    };
    logger.info(
      `[Sign up]: Sign up process started: ${JSON.stringify(payload)}`,
    );
    try {
      const tokens = await this.generateAuthTokens(payload);
      logger.info(
        `[Sign up]: Sign up process succeeded: ${JSON.stringify(tokens)}`,
      );
      return tokens;
    } catch (error) {
      logger.error(
        `[Sign up]: Sign up process failed: ${JSON.stringify(error)}`,
      );
      throw error;
    }
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    try {
      const token = await this.prismaService.refreshToken.findFirst({
        where: {
          userId: userId,
          revokedAt: null,
        },
      });

      if (token && (await bcrypt.compare(refreshToken, token.token))) {
        await this.prismaService.refreshToken.update({
          where: { id: token.id },
          data: { revokedAt: new Date(), expiresAt: new Date() },
        });

        logger.info(`User ${userId} logged out successfully`);
      } else {
        logger.warn(`Logout attempted with invalid token for user ${userId}`);
      }
    } catch (error) {
      logger.error(`Error during logout for user ${userId}:`, error);
      throw new Error('Logout failed');
    }
  }

  async refreshAccessToken(
    token: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const foundToken = await this.prismaService.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!token) {
      throw new UnauthorizedException('Refresh token not found');
    }
    if (!foundToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (foundToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    if (foundToken.revokedAt) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    const { user } = foundToken;
    const { id, email } = user;

    const payload: TokenPayload = {
      id,
      email,
    };
    const { accessToken, refreshToken: newRefreshToken } =
      await this.generateAuthTokens(payload);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async revokeRefreshToken(refreshToken: string) {
    await this.prismaService.refreshToken.update({
      where: { token: refreshToken },
      data: { revokedAt: new Date() },
    });
  }

  async getUserIdFromRefreshToken(
    refreshToken: string,
  ): Promise<string | null> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>(JWT_REFRESH_SECRET),
      });
      return payload.sub;
    } catch (error) {
      logger.error(
        `[Get userId from refresh token]: Get user id from refresh token process failed: ${JSON.stringify(error)}`,
      );
      return null;
    }
  }

  /**
   * Generate a JWT token with the provided parameters.
   *
   * @param params {Record<string, any>} - Additional parameters to include in the token payload.
   * @param type {TokenType} - Type of the token (e.g., ACCESS, REFRESH, RESET_PASSWORD).
   * @param expires {Date} - Expiration date of the token.
   * @param secret {string} - Secret key used for signing the token.
   * @returns {Promise<string>} Generated JWT token.
   */
  private async generateToken(
    payload: TokenPayload,
    type: TokenTypes,
    expiresIn: string,
    secret: string,
  ): Promise<string> {
    const jwtPayload: JwtPayload = {
      sub: payload?.id?.toString(),
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + this.parseExpirationTime(expiresIn),
      type,
      ...payload,
    };

    return this.jwtService.signAsync(jwtPayload, { secret });
  }

  /**
   * Generate authentication tokens for the given payload.
   *
   * @param payload - The payload containing user information.
   * @returns An object containing the access and refresh tokens.
   */
  private async generateAuthTokens(payload: TokenPayload) {
    const accessTokenExpiration = this.configService.get<string>(
      JWT_ACCESS_EXPIRATION,
    );

    const accessToken = await this.generateToken(
      payload,
      TokenTypes.ACCESS,
      accessTokenExpiration,
      this.configService.get<string>(JWT_ACCESS_SECRET),
    );
    const refreshToken = await this.createRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
    };
  }

  private parseExpirationTime(expiresIn: string): number {
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1), 10);

    switch (unit) {
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 24 * 60 * 60;
      default:
        throw new Error('Invalid expiration time format');
    }
  }

  private async createRefreshToken(payload: TokenPayload) {
    const refreshTokenExpiration = this.configService.get<string>(
      JWT_REFRESH_EXPIRATION,
    );

    const refreshToken = await this.generateToken(
      payload,
      TokenTypes.REFRESH,
      refreshTokenExpiration,
      this.configService.get<string>(JWT_REFRESH_SECRET),
    );
    const expiresAt = new Date(
      Date.now() + this.parseExpirationTime(refreshTokenExpiration),
    );
    const refreshTokenHashed = await bcrypt.hash(refreshToken, 10);

    await this.prismaService.refreshToken.create({
      data: {
        userId: payload.id,
        token: refreshTokenHashed,
        expiresAt,
      },
    });

    return refreshToken;
  }
}
