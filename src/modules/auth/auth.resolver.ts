import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { User } from '@prisma/client';

// Services
import { AuthService } from './auth.service';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { UsersService } from '../users/users.service';

// Entities
import { TwoFactorAuthSecret } from './entities/two-factor-auth.entity';

// Guards
import { JwtAuthGuard } from './guards/jwt-auth.guard';

// Decorators
import { CurrentUser } from '@/decorators/current-user.decorator';

// Inputs
import { LoginInput } from './inputs/login.input';
import { LoginUserTwoFactorInput } from './inputs/login-user-two-factor';
import { RegisterInput } from './inputs/register.input';

// Responses
import { LoginResponse } from './responses/login.response';
import { LoginUserTwoFactorResponse } from './responses/login-user-two-factor.response';
import { RefreshTokenInput } from './inputs/refresh-token.input';
import { RefreshTokenResponse } from './responses/refresh-token.response';
import { RegisterResponse } from './responses/register.response';
import { LogoutResponse } from './responses/logout.response';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly twoFactorAuthService: TwoFactorAuthService,
    private readonly usersService: UsersService,
  ) {}

  @Mutation(() => LoginResponse)
  async login(@Args('loginInput') loginInput: LoginInput) {
    const user = await this.authService.validateUser(
      loginInput.email,
      loginInput.password,
    );

    return this.authService.login(user);
  }

  @Mutation(() => RegisterResponse)
  async register(@Args('registerInput') registerInput: RegisterInput) {
    const newUser = await this.usersService.create(registerInput);

    const tokens = await this.authService.register(newUser);

    return {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      isActive: newUser.isActive,
      emailVerified: newUser.emailVerified,
      isTwoFactorAuthEnabled: newUser.isTwoFactorAuthEnabled,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  @Mutation(() => LogoutResponse)
  async logout(@Args('refreshToken') refreshToken: string) {
    try {
      const userId =
        await this.authService.getUserIdFromRefreshToken(refreshToken);
      if (!userId) {
        return { success: false, message: 'Invalid refresh token' };
      }

      await this.authService.logout(userId, refreshToken);

      return { success: true, message: 'Logout successful' };
    } catch (error) {
      return { success: false, message: 'Logout failed', error: error.message };
    }
  }

  @Mutation(() => RefreshTokenResponse)
  async refreshToken(
    @Args('refreshTokenInput') refreshTokenInput: RefreshTokenInput,
  ) {
    const { refreshToken } = refreshTokenInput;

    return await this.authService.refreshAccessToken(refreshToken);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async revokeRefreshToken(
    @Args('refreshTokenInput') { refreshToken }: RefreshTokenInput,
  ) {
    await this.authService.revokeRefreshToken(refreshToken);

    return true;
  }

  @Mutation(() => TwoFactorAuthSecret)
  @UseGuards(JwtAuthGuard)
  async generateTwoFactorAuthSecret(@CurrentUser() user: User) {
    const { secret, otpauthUrl } =
      await this.twoFactorAuthService.generateTwoFactorAuthenticationSecret(
        user.id,
      );

    const qrCodeDataURL =
      await this.twoFactorAuthService.generateQrCodeDataURL(otpauthUrl);

    return { secret, qrCodeDataURL };
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async enableTwoFactorAuth(
    @CurrentUser() user: User,
    @Args('token') token: string,
  ) {
    return this.twoFactorAuthService.enableTwoFactorAuth(user.id, token);
  }

  @Mutation(() => LoginUserTwoFactorResponse)
  async loginWithTwoFactor(
    @Args('loginUserTwoFactorInput')
    loginUserTwoFactorInput: LoginUserTwoFactorInput,
  ) {
    const { email, password, twoFactorToken } = loginUserTwoFactorInput;

    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.isTwoFactorAuthEnabled) {
      const isValid = await this.twoFactorAuthService.verifyTwoFactorAuth(
        user.id,
        twoFactorToken,
      );

      if (!isValid) {
        throw new UnauthorizedException('Invalid two-factor token');
      }
    }

    return this.authService.login(user);
  }
}
