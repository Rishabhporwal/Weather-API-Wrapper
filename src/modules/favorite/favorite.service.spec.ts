import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteService } from './favorite.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { User } from './../auth/entities/user.entity';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('FavoriteService', () => {
  let service: FavoriteService;
  let favoriteRepo: Repository<Favorite>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoriteService,
        {
          provide: getRepositoryToken(Favorite),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<FavoriteService>(FavoriteService);
    favoriteRepo = module.get<Repository<Favorite>>(
      getRepositoryToken(Favorite),
    );
  });

  describe('addFavorite', () => {
    it('should add a favorite location', async () => {
      const user: User = { id: 1 } as User;
      const createFavoriteDto: CreateFavoriteDto = { city: 'London' };
      const favorite: Favorite = { id: 1, city: 'London', user } as Favorite;

      jest.spyOn(favoriteRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(favoriteRepo, 'create').mockReturnValue(favorite);
      jest.spyOn(favoriteRepo, 'save').mockResolvedValue(favorite);

      const result = await service.addFavorite(user, createFavoriteDto);

      expect(result).toEqual(favorite);
      expect(favoriteRepo.findOne).toHaveBeenCalledWith({
        where: { city: createFavoriteDto.city, user: { id: user.id } },
      });
      expect(favoriteRepo.create).toHaveBeenCalledWith({
        ...createFavoriteDto,
        user,
      });
      expect(favoriteRepo.save).toHaveBeenCalledWith(favorite);
    });

    it('should throw InternalServerErrorException if favorite location already exists', async () => {
      const user: User = { id: 1 } as User;
      const createFavoriteDto: CreateFavoriteDto = { city: 'London' };
      const favorite: Favorite = { id: 1, city: 'London', user } as Favorite;

      jest.spyOn(favoriteRepo, 'findOne').mockResolvedValue(favorite);

      await expect(
        service.addFavorite(user, createFavoriteDto),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw InternalServerErrorException if an error occurs', async () => {
      const user: User = { id: 1 } as User;
      const createFavoriteDto: CreateFavoriteDto = { city: 'London' };

      jest
        .spyOn(favoriteRepo, 'findOne')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        service.addFavorite(user, createFavoriteDto),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getFavorites', () => {
    it('should return a list of favorite locations', async () => {
      const user: User = { id: 1 } as User;
      const favorites: Favorite[] = [
        { id: 1, city: 'London', user },
      ] as Favorite[];

      jest.spyOn(favoriteRepo, 'find').mockResolvedValue(favorites);

      const result = await service.getFavorites(user);

      expect(result).toEqual(favorites);
      expect(favoriteRepo.find).toHaveBeenCalledWith({ where: { user } });
    });

    it('should throw InternalServerErrorException if an error occurs', async () => {
      const user: User = { id: 1 } as User;

      jest
        .spyOn(favoriteRepo, 'find')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.getFavorites(user)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('removeFavorite', () => {
    it('should remove a favorite location', async () => {
      const user: User = { id: 1 } as User;
      const favorite: Favorite = { id: 1, city: 'London', user } as Favorite;

      jest.spyOn(favoriteRepo, 'findOne').mockResolvedValue(favorite);
      jest.spyOn(favoriteRepo, 'remove').mockResolvedValue(favorite);

      const result = await service.removeFavorite(user, 1);

      expect(result).toEqual(favorite);
      expect(favoriteRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1, user },
      });
      expect(favoriteRepo.remove).toHaveBeenCalledWith(favorite);
    });

    it('should throw NotFoundException if favorite location is not found', async () => {
      const user: User = { id: 1 } as User;

      jest.spyOn(favoriteRepo, 'findOne').mockResolvedValue(null);

      await expect(service.removeFavorite(user, 1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw InternalServerErrorException if an error occurs', async () => {
      const user: User = { id: 1 } as User;

      jest
        .spyOn(favoriteRepo, 'findOne')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.removeFavorite(user, 1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getAllFavoriteLocations', () => {
    it('should return a list of all favorite locations', async () => {
      const favorites: Favorite[] = [
        { id: 1, city: 'London', user: { id: 1 } },
      ] as Favorite[];

      jest.spyOn(favoriteRepo, 'find').mockResolvedValue(favorites);

      const result = await service.getAllFavoriteLocations();

      expect(result).toEqual(favorites);
      expect(favoriteRepo.find).toHaveBeenCalledWith({ relations: ['user'] });
    });

    it('should throw InternalServerErrorException if an error occurs', async () => {
      jest
        .spyOn(favoriteRepo, 'find')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.getAllFavoriteLocations()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
