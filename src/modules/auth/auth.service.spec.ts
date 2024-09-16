/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { UsersService } from '@/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');
jest.mock('@/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            refreshToken: {
              findFirst: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('validateUser', () => {
    it('should return user if email and password are valid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser(
        'test@example.com',
        'password',
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null if password is invalid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await authService.validateUser(
        'test@example.com',
        'wrongpassword',
      );
      expect(result).toBeNull();
    });

    it('should throw UnauthorizedException if user not found', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.validateUser('nonexistent@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should generate and return auth tokens', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      const mockTokens = {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      };
      jest
        .spyOn(authService as any, 'generateAuthTokens')
        .mockResolvedValue(mockTokens);

      const result = await authService.login(mockUser as any);
      expect(result).toEqual(mockTokens);
    });
  });

  describe('register', () => {
    it('should generate and return auth tokens', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      const mockTokens = {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      };
      jest
        .spyOn(authService as any, 'generateAuthTokens')
        .mockResolvedValue(mockTokens);

      const result = await authService.register(mockUser as any);
      expect(result).toEqual(mockTokens);
    });
  });

  describe('logout', () => {
    it('should revoke refresh token if valid', async () => {
      const mockToken = { id: '1', token: 'hashedToken' };
      (prismaService.refreshToken.findFirst as jest.Mock).mockResolvedValue(
        mockToken,
      );
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await authService.logout('1', 'refreshToken');

      expect(prismaService.refreshToken.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: expect.objectContaining({
          revokedAt: expect.any(Date),
          expiresAt: expect.any(Date),
        }),
      });
    });
  });

  describe('refreshAccessToken', () => {
    it('should return new access and refresh tokens', async () => {
      const mockToken = {
        token: 'refreshToken',
        expiresAt: new Date(Date.now() + 1000000),
        revokedAt: null,
        user: { id: '1', email: 'test@example.com' },
      };
      (prismaService.refreshToken.findUnique as jest.Mock).mockResolvedValue(
        mockToken,
      );
      const mockNewTokens = {
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      };
      jest
        .spyOn(authService as any, 'generateAuthTokens')
        .mockResolvedValue(mockNewTokens);

      const result = await authService.refreshAccessToken('refreshToken');
      expect(result).toEqual(mockNewTokens);
    });

    it('should throw UnauthorizedException if token not found', async () => {
      (prismaService.refreshToken.findUnique as jest.Mock).mockResolvedValue(
        null,
      );

      await expect(
        authService.refreshAccessToken('invalidToken'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // Add more test cases for other methods...
});
