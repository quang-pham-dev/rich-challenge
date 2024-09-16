import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class LoginUserTwoFactorResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field()
  twoFactorToken: string;
}
