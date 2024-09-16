import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User as UserPrisma } from '@prisma/client';

@ObjectType()
export class User implements UserPrisma {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field(() => Date, { nullable: true })
  username: string;

  @Field()
  password: string;

  @Field(() => Date, { nullable: true })
  twoFactorAuthSecret: string;

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

  @Field(() => Date, { nullable: true })
  lastLoginAt: Date;
}
