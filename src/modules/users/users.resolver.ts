import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

// Services
import { UsersService } from './users.service';

// Inputs
import { CreateUserInput } from './inputs/create-user.input';
import { UpdateUserInput } from './inputs/update-user.input';
import { DeleteUserInput } from './inputs/delete-user.input';

// Entities
import { User } from './entities/user.entity';

// Responses
import { CreateUserResponse } from './responses/create-user.response';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => User, { name: 'user' })
  async findOne(@Args('id') id: number): Promise<User> {
    return this.usersService.findOne(id);
  }
  @Query(() => [User], { name: 'allUsers' })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Mutation(() => CreateUserResponse, { name: 'createUser' })
  async create(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Mutation(() => User, { name: 'updateUser' })
  async update(
    @Args('id') id: number,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return this.usersService.update(id, updateUserInput);
  }

  @Mutation(() => User, { name: 'deleteUser' })
  async delete(
    @Args('deleteUserInput') deleteUserInput: DeleteUserInput,
  ): Promise<User> {
    return this.usersService.delete(deleteUserInput.id);
  }
}
