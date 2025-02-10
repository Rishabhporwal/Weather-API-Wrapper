import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteService } from './favorite.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';

describe('FavoriteService', () => {
  let service: FavoriteService;
  let repo: Repository<Favorite>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoriteService,
        {
          provide: getRepositoryToken(Favorite),
          useClass: class {
            find = jest.fn();
            save = jest.fn();
            findOne = jest.fn();
          },
        },
      ],
    }).compile();

    service = module.get<FavoriteService>(FavoriteService);
    repo = module.get<Repository<Favorite>>(getRepositoryToken(Favorite));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return favorite locations', async () => {
    jest.spyOn(repo, 'find').mockResolvedValue([
      {
        id: 1,
        city: 'Paris',
        user: {
          email: '',
          favorites: [],
          id: 1,
          password: '123',
          hashPassword: () => 1 as any,
        },
      },
    ]);

    const result = await service.getAllFavoriteLocations();
    console.log('Result', result);
    expect(result[0].id).toEqual(1);
    expect(result[0].city).toEqual('Paris');
  });

  it('should add a new favorite location', async () => {
    try {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      jest.spyOn(repo, 'save').mockResolvedValue({
        id: 1,
        city: 'Paris',
        user: {
          email: '',
          favorites: [],
          id: 1,
          password: '123',
          hashPassword: () => 1 as any,
        },
      });

      const result = await service.addFavorite({ userId: 1, city: 'Berlin' });
      console.log('Result', result);
      expect(result).toEqual({ id: 2, city: 'Berlin' });
    } catch (error) {
      console.log('Error', error);
    }
  });

  it('should not add duplicate favorite locations', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValue({
      id: 1,
      city: 'Paris',
      user: {
        email: '',
        favorites: [],
        id: 1,
        password: '123',
        hashPassword: () => 1 as any,
      },
    });

    await expect(
      service.addFavorite({ userId: 1, city: 'London' }),
    ).rejects.toThrow('City London is already in favorites');
  });
});
