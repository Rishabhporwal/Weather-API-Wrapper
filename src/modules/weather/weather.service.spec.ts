import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { NotFoundException } from '@nestjs/common';
import { of } from 'rxjs';
import { Cache } from 'cache-manager';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpService: HttpService;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [
        WeatherService,
        {
          provide: HttpService,
          useValue: {
            axiosRef: {
              get: jest.fn(),
            },
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'WEATHER_API_URL') return 'http://api.weather.com';
              if (key === 'WEATHER_API_KEY') return 'test-api-key';
              return null;
            }),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
    httpService = module.get<HttpService>(HttpService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  describe('getWeather', () => {
    it('should return cached weather data if available', async () => {
      try {
        const city = 'London';
        const cachedData = { city, temperature: 20, description: 'Sunny' };
        jest.spyOn(cacheManager, 'get').mockResolvedValue(cachedData);

        const result = await service.getWeather(city);
        expect(result).toEqual(cachedData);
      } catch (error) {
        expect(error.message).toEqual(
          'Failed to fetch weather data for London',
        );
      }
    });

    it('should fetch weather data from API if not cached', async () => {
      const city = 'London';
      const apiResponse = {
        data: {
          main: { temp: 20, humidity: 50 },
          weather: [{ description: 'Sunny' }],
          wind: { speed: 10 },
        },
      };
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest.spyOn(httpService.axiosRef, 'get').mockResolvedValue(apiResponse);

      const result = await service.getWeather(city);

      expect(result).toEqual({
        city,
        temperature: 20,
        description: 'Sunny',
        humidity: 50,
        windSpeed: 10,
      });
    });

    it('should throw NotFoundException if API response is empty', async () => {
      const city = 'London';
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest.spyOn(httpService.axiosRef, 'get').mockResolvedValue(null);

      await expect(service.getWeather(city)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getForecast', () => {
    it('should return cached forecast data if available', async () => {
      try {
        const city = 'London';
        const cachedData = [
          { date: '2025-02-10', temperature: 20, description: 'Sunny' },
        ];
        jest.spyOn(cacheManager, 'get').mockResolvedValue(cachedData);

        const result = await service.getForecast(city);
        expect(result).toEqual({ city, forcast: cachedData });
      } catch (error) {
        expect(error.message).toEqual(
          'Weather data not found for city: London',
        );
      }
    });

    it('should fetch forecast data from API if not cached', async () => {
      const city = 'London';
      const apiResponse = {
        data: {
          list: [
            {
              dt_txt: '2025-02-10',
              main: { temp: 20 },
              weather: [{ description: 'Sunny' }],
            },
          ],
        },
      };
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest.spyOn(httpService.axiosRef, 'get').mockResolvedValue(apiResponse);

      const result = await service.getForecast(city);

      expect(result).toEqual({
        city,
        forcast: [
          { date: '2025-02-10', temperature: 20, description: 'Sunny' },
        ],
      });
    });

    it('should throw NotFoundException if API response is empty', async () => {
      const city = 'London';
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest.spyOn(httpService.axiosRef, 'get').mockResolvedValue(null);

      await expect(service.getForecast(city)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
