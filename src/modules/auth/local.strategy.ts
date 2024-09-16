import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';

// Modules
import { User } from '@prisma/client';

// Auth module
import { AuthService } from './auth.service';
import { STRATEGY_LOCAL } from '@/constants/strategy.constant';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, STRATEGY_LOCAL) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'emailAddress', passwordField: 'password' });
  }

  async validate(emailAddress: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(emailAddress, password);

    return user;
  }
}
