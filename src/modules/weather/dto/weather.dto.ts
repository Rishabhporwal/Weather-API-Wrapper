import { IsString } from 'class-validator';
import { Field, ObjectType } from '@nestjs/graphql';

export class GetWeatherDto {
  @IsString()
  city: string;
}

@ObjectType()
export class WeatherDto {
  @Field()
  city: string;

  @Field()
  temperature: number;

  @Field()
  description: string;

  @Field()
  humidity: number;

  @Field()
  windSpeed: number;
}
