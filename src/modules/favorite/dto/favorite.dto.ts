import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FavoriteDto {
  @Field()
  id: number;

  @Field()
  city: string;
}
