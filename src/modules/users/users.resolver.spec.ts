import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { CreateUserInput } from './inputs/create-user.input';
import { UpdateUserInput } from './inputs/update-user.input';
import { DeleteUserInput } from './inputs/delete-user.input';
import { User } from './entities/user.entity';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const result = { id: 1, name: 'John Doe' } as unknown as User;
      jest.spyOn(usersService, 'findOne').mockResolvedValue(result);
      expect(await resolver.findOne(1)).toBe(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' },
      ] as unknown as User[];
      jest.spyOn(usersService, 'findAll').mockResolvedValue(result);
      expect(await resolver.findAll()).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserInput: CreateUserInput = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      };
      const result = {
        id: '1',
        ...createUserInput,
        username: 'johndoe',
        emailVerified: false,
        isActive: true,
        isTwoFactorAuthEnabled: false,
        twoFactorAuthSecret: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
      };
      jest.spyOn(usersService, 'create').mockResolvedValue(result);
      expect(await resolver.create(createUserInput)).toBe(result);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserInput: UpdateUserInput = {
        name: 'Jane Doe',
        email: '',
        password: '',
      };
      const result = { id: 1, ...updateUserInput } as unknown as User;
      jest.spyOn(usersService, 'update').mockResolvedValue(result);
      expect(await resolver.update(1, updateUserInput)).toBe(result);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const deleteUserInput: DeleteUserInput = { id: 1 };
      const result = { id: 1, name: 'John Doe' } as unknown as User;
      jest.spyOn(usersService, 'delete').mockResolvedValue(result);
      expect(await resolver.delete(deleteUserInput)).toBe(result);
    });
  });
});
