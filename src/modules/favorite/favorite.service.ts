import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { User } from './../auth/entities/user.entity';

@Injectable()
export class FavoriteService {
  private readonly logger = new Logger(FavoriteService.name);

  constructor(
    @InjectRepository(Favorite) private favoriteRepo: Repository<Favorite>,
  ) {}

  async addFavorite(user: User, createFavoriteDto: CreateFavoriteDto) {
    try {
      const favorite = this.favoriteRepo.create({ ...createFavoriteDto, user });

      const favoriteLocationExist = await this.favoriteRepo.findOne({
        where: { city: createFavoriteDto?.city, user: { id: user?.id } },
      });
      if (favoriteLocationExist) {
        this.logger.warn(
          `Location ${createFavoriteDto?.city} is already added in favorite!`,
        );
        throw new ConflictException(
          `Location ${createFavoriteDto?.city} is already added in favorite!`,
        );
      }
      const savedFavorite = await this.favoriteRepo.save(favorite);
      this.logger.log(`Favorite added successfully for user: ${user.id}`);
      return savedFavorite;
    } catch (error) {
      this.logger.error(
        `Failed to add favorite for user: ${user.id}`,
        error.message,
      );
      throw new InternalServerErrorException(
        'Failed to add favorite',
        error.message,
      );
    }
  }

  async getFavorites(user: User) {
    try {
      const favorites = await this.favoriteRepo.find({ where: { user } });
      this.logger.log(`Favorites retrieved successfully for user: ${user.id}`);
      return favorites;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve favorites for user: ${user.id}`,
        error.message,
      );
      throw new InternalServerErrorException(
        'Failed to retrieve favorites',
        error.message,
      );
    }
  }

  async removeFavorite(user: User, id: number) {
    try {
      const favorite = await this.favoriteRepo.findOne({ where: { id, user } });
      if (!favorite) {
        this.logger.warn(
          `Favorite location not found for user: ${user.id}, favorite id: ${id}`,
        );
        throw new NotFoundException('Favorite location not found');
      }
      await this.favoriteRepo.remove(favorite);
      this.logger.log(
        `Favorite removed successfully for user: ${user.id}, favorite id: ${id}`,
      );
      return favorite;
    } catch (error) {
      this.logger.error(
        `Failed to remove favorite for user: ${user.id}, favorite id: ${id}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to remove favorite: ',
        error.message,
      );
    }
  }

  async getAllFavoriteLocations(): Promise<Favorite[]> {
    try {
      const favorites = await this.favoriteRepo.find({ relations: ['user'] });
      this.logger.log('All favorite locations retrieved successfully');
      return favorites;
    } catch (error) {
      this.logger.error(
        'Failed to retrieve all favorite locations',
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to retrieve all favorite locations',
      );
    }
  }
}
