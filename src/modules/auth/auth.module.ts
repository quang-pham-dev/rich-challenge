import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthResolver } from './auth.resolver';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { TwoFactorAuthService } from './two-factor-auth.service';

import { JWT_ACCESS_SECRET } from '@/constants/jwt.constant';

import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),

    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>(JWT_ACCESS_SECRET);
        if (!secret) {
          throw new Error("Didn't get a valid jwt secret");
        }
        return {
          secret,
        };
      },
      inject: [ConfigService],
    }),
    PrismaModule,
    ConfigModule,
  ],

  providers: [
    AuthService,
    TwoFactorAuthService,
    AuthResolver,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
