import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { TwoFactorAuthService } from './two-factor-auth.service';

describe('AuthResolver', () => {
  let resolver: AuthResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: {
            // mock implementation of AuthService methods
          },
        },
        {
          provide: UsersService,
          useValue: {
            // mock implementation of UsersService methods
          },
        },
        {
          provide: TwoFactorAuthService,
          useValue: {
            // mock implementation of TwoFactorAuthService methods
          },
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  // other tests...
});
