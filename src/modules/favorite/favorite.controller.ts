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
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Favorites')
@ApiBearerAuth() // Requires JWT authentication
@Controller('favorites')
export class FavoriteController {
  constructor(private favoriteService: FavoriteService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Add a new favorite location' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        city: { type: 'string', example: 'San Francisco' },
        userId: { type: 'string', example: '123' },
      },
    },
  })
  addFavorite(@Request() req, @Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoriteService.addFavorite(req.user, createFavoriteDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all favorite locations for the user' })
  getFavorites(@Request() req) {
    return this.favoriteService.getFavorites(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Remove a favorite location' })
  @ApiParam({ name: 'id', description: 'Favorite ID', example: 1 })
  removeFavorite(@Request() req, @Param('id') id: number) {
    return this.favoriteService.removeFavorite(req.user, id);
  }
}
