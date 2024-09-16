import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class RegisterResponse {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field(() => String, { nullable: true })
  username: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  isActive: boolean;

  @Field()
  emailVerified: boolean;

  @Field()
  isTwoFactorAuthEnabled: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => String, { nullable: true })
  twoFactorAuthSecret?: string;

  @Field(() => String, { nullable: true })
  lastLoginAt?: Date;
}
