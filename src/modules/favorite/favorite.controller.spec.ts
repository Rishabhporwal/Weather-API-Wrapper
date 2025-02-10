import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('FavoriteController', () => {
  let controller: FavoriteController;
  let service: FavoriteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoriteController],
      providers: [
        {
          provide: FavoriteService,
          useValue: {
            addFavorite: jest.fn(),
            getFavorites: jest.fn(),
            removeFavorite: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest();
          request.user = { id: 1 }; // Mock user
          return true;
        },
      })
      .compile();

    controller = module.get<FavoriteController>(FavoriteController);
    service = module.get<FavoriteService>(FavoriteService);
  });

  describe('addFavorite', () => {
    it('should add a favorite location', async () => {
      const createFavoriteDto: CreateFavoriteDto = { city: 'London' };
      const favorite = {
        id: 1,
        city: 'London',
        user: { id: 1, email: 'test@example.com', password: 'password', favorites: [], validatePassword: jest.fn() },
        createdAt: new Date(),
      };

      jest.spyOn(service, 'addFavorite').mockResolvedValue(favorite);

      const result = await controller.addFavorite(
        { user: { id: 1 } },
        createFavoriteDto,
      );

      expect(result).toEqual(favorite);
      expect(service.addFavorite).toHaveBeenCalledWith(
        { id: 1 },
        createFavoriteDto,
      );
    });
  });

  describe('getFavorites', () => {
    it('should return a list of favorite locations', async () => {
      const favorites = [{
        id: 1,
        city: 'London',
        user: { id: 1, email: 'test@example.com', password: 'password', favorites: [], validatePassword: jest.fn() },
        createdAt: new Date(),
      }];

      jest.spyOn(service, 'getFavorites').mockResolvedValue(favorites);

      const result = await controller.getFavorites({ user: { id: 1 } });

      expect(result).toEqual(favorites);
      expect(service.getFavorites).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('removeFavorite', () => {
    it('should remove a favorite location', async () => {
      const favorite = {
        id: 1,
        city: 'London',
        user: { id: 1, email: 'test@example.com', password: 'password', favorites: [], validatePassword: jest.fn() },
        createdAt: new Date(),
      };

      jest.spyOn(service, 'removeFavorite').mockResolvedValue(favorite);

      const result = await controller.removeFavorite({ user: { id: 1 } }, 1);

      expect(result).toEqual(favorite);
      expect(service.removeFavorite).toHaveBeenCalledWith({ id: 1 }, 1);
    });
  });
});