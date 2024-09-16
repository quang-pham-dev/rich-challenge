import { forwardRef, Module } from '@nestjs/common';

// Controllers

// Services
import { UsersService } from './users.service';

// Resolvers
import { UsersResolver } from './users.resolver';

// Modules
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule)],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
