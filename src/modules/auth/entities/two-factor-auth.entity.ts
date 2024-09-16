import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class TwoFactorAuthSecret {
  @Field()
  secret: string;

  @Field()
  qrCodeDataURL: string;
}
