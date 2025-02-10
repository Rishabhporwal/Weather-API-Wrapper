import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Favorite } from './entities/favorite.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';

@Resolver(() => Favorite)
@UseGuards(JwtAuthGuard)
export class FavoriteResolver {
  constructor(private favoriteService: FavoriteService) {}

  @Mutation(() => Favorite)
  async addFavorite(
    @Context() ctx,
    @Args('city') city: string,
    @Args('country') country: string,
  ) {
    const createFavoriteDto = new CreateFavoriteDto();
    createFavoriteDto.city = city;
    return this.favoriteService.addFavorite(ctx.req.user, createFavoriteDto);
  }

  @Query(() => [Favorite])
  async getFavorites(@Context() ctx) {
    return this.favoriteService.getFavorites(ctx.req.user);
  }

  @Mutation(() => Boolean)
  async removeFavorite(@Context() ctx, @Args('id') id: number) {
    await this.favoriteService.removeFavorite(ctx.req.user, id);
    return true;
  }
}
