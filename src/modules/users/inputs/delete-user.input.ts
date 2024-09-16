import { Field, InputType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class DeleteUserInput {
  @Field(() => Number)
  @IsNumber()
  id: number;
}
