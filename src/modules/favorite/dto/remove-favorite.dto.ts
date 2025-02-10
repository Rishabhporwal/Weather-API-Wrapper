import { IsInt } from 'class-validator';

export class RemoveFavoriteDto {
  @IsInt()
  id: number;
}
