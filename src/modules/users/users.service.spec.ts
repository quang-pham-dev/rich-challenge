import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput } from './inputs/create-user.input';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');
jest.mock('@/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserInput: CreateUserInput = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const hashedPassword = 'hashedPassword';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const createdUser: User = {
        id: '1',
        ...createUserInput,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        username: '',
        emailVerified: false,
        isActive: false,
        isTwoFactorAuthEnabled: false,
        twoFactorAuthSecret: '',
        lastLoginAt: undefined,
      };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prismaService.user.create as jest.Mock).mockResolvedValue(createdUser);

      const result = await service.create(createUserInput);

      expect(result).toEqual(createdUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: createUserInput.email },
      });
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          ...createUserInput,
          password: hashedPassword,
        },
      });
    });

    it('should throw BadRequestException if email already exists', async () => {
      const createUserInput: CreateUserInput = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        email: createUserInput.email,
      });

      await expect(service.create(createUserInput)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      const createUserInput: CreateUserInput = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      (prismaService.user.findUnique as jest.Mock).mockRejectedValue(
        new Error('Unexpected error'),
      );

      await expect(service.create(createUserInput)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user: User = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
        username: '',
        emailVerified: false,
        isActive: false,
        isTwoFactorAuthEnabled: false,
        twoFactorAuthSecret: '',
        lastLoginAt: undefined,
      };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(user);

      const result = await service.findOne(1);

      expect(result).toEqual(user);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const user: User = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
        username: '',
        emailVerified: false,
        isActive: false,
        isTwoFactorAuthEnabled: false,
        twoFactorAuthSecret: '',
        lastLoginAt: undefined,
      };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(user);

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(user);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users: User[] = [
        {
          id: '1',
          email: 'test1@example.com',
          password: 'hashedPassword1',
          firstName: 'John',
          lastName: 'Doe',
          createdAt: new Date(),
          updatedAt: new Date(),
          username: '',
          emailVerified: false,
          isActive: false,
          isTwoFactorAuthEnabled: false,
          twoFactorAuthSecret: '',
          lastLoginAt: undefined,
        },
        {
          id: '2',
          email: 'test2@example.com',
          password: 'hashedPassword2',
          firstName: 'Jane',
          lastName: 'Doe',
          createdAt: new Date(),
          updatedAt: new Date(),
          username: '',
          emailVerified: false,
          isActive: false,
          isTwoFactorAuthEnabled: false,
          twoFactorAuthSecret: '',
          lastLoginAt: undefined,
        },
      ];

      (prismaService.user.findMany as jest.Mock).mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(prismaService.user.findMany).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updatedUser: User = {
        id: '1',
        email: 'updated@example.com',
        password: 'hashedPassword',
        firstName: 'Updated',
        lastName: 'User',
        createdAt: new Date(),
        updatedAt: new Date(),
        username: '',
        emailVerified: false,
        isActive: false,
        isTwoFactorAuthEnabled: false,
        twoFactorAuthSecret: '',
        lastLoginAt: undefined,
      };

      (prismaService.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await service.update(1, { email: 'updated@example.com' });

      expect(result).toEqual(updatedUser);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { email: 'updated@example.com' },
      });
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const deletedUser: User = {
        id: '1',
        email: 'deleted@example.com',
        password: 'hashedPassword',
        firstName: 'Deleted',
        lastName: 'User',
        createdAt: new Date(),
        updatedAt: new Date(),
        username: '',
        emailVerified: false,
        isActive: false,
        isTwoFactorAuthEnabled: false,
        twoFactorAuthSecret: '',
        lastLoginAt: undefined,
      };

      (prismaService.user.delete as jest.Mock).mockResolvedValue(deletedUser);

      const result = await service.delete(1);

      expect(result).toEqual(deletedUser);
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
