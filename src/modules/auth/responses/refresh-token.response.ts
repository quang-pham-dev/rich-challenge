import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class RefreshTokenResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
