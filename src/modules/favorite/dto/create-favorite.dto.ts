import { IsString, Length } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateFavoriteDto {
  @IsString()
  @Field()
  @IsString()
  @Length(2, 100)
  city: string;
}
