import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { FavoriteResolver } from './favorite.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite])],
  providers: [FavoriteService, FavoriteResolver],
  controllers: [FavoriteController],
  exports: [FavoriteService],
})
export class FavoriteModule {}
