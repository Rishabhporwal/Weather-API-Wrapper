import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';

@Controller('favorites')
export class FavoriteController {
  constructor(private favoriteService: FavoriteService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  addFavorite(@Request() req, @Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoriteService.addFavorite(req.user, createFavoriteDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getFavorites(@Request() req) {
    return this.favoriteService.getFavorites(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  removeFavorite(@Request() req, @Param('id') id: number) {
    return this.favoriteService.removeFavorite(req.user, id);
  }
}
