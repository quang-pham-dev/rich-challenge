import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Services
import { PrismaService } from '../prisma/prisma.service';

// Inputs
import { CreateUserInput } from './inputs/create-user.input';

// Utils
import { logger } from '@/utils/logger';

// Constants
import { ERRORS_MESSAGE } from '@/constants/errors-message.constant';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const { password: passwordInput } = createUserInput;
    try {
      const existingUser = await this.findByEmail(createUserInput.email);
      if (existingUser) {
        throw new BadRequestException(ERRORS_MESSAGE.EMAIL_ALREADY_EXISTS);
      }

      const password = await bcrypt.hash(passwordInput, 10);
      const data = {
        ...createUserInput,
        password,
      };

      logger.info('[Users Service] - Creating user', { data });
      const newUser = await this.prisma.user.create({
        data,
      });
      logger.info('[Users Service] - User created', { newUser });
      return newUser;
    } catch (error) {
      logger.error('[Users Service] - Creating user error', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        ERRORS_MESSAGE.SOME_THING_WENT_WRONG,
      );
    }
  }

  async findOne(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id: id.toString() } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  // async create(data: Prisma.UserCreateInput): Promise<User> {
  //   return this.prisma.user.create({ data });
  // }

  async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({ where: { id: id.toString() }, data });
  }

  async delete(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id: id.toString() } });
  }
}
