import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { FavoriteService } from './favorite.service';
import { Favorite } from './entities/favorite.entity';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UseGuards } from '@nestjs/common';
import { User } from '../auth/entities/user.entity';

@Resolver(() => Favorite)
export class FavoriteResolver {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Mutation(() => Favorite)
  async addFavorite(
    user: User,
    @Args('createFavoriteDto') createFavoriteDto: CreateFavoriteDto,
  ): Promise<Favorite> {
    return this.favoriteService.addFavorite(user, createFavoriteDto);
  }

  @Query(() => [Favorite])
  async getFavorites(user: User): Promise<Favorite[]> {
    return this.favoriteService.getFavorites(user);
  }

  @Mutation(() => Favorite)
  async removeFavorite(user: User, @Args('id') id: number): Promise<Favorite> {
    return this.favoriteService.removeFavorite(user, id);
  }

  @Query(() => [Favorite])
  async getAllFavoriteLocations(): Promise<Favorite[]> {
    return this.favoriteService.getAllFavoriteLocations();
  }
}
