import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ExecutionContext } from '@nestjs/common';

describe('WeatherController', () => {
  let controller: WeatherController;
  let service: WeatherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ThrottlerModule.forRoot([{ ttl: 60, limit: 10 }])],
      controllers: [WeatherController],
      providers: [
        {
          provide: WeatherService,
          useValue: {
            getWeather: jest.fn(),
            getForecast: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => true,
      })
      .compile();

    controller = module.get<WeatherController>(WeatherController);
    service = module.get<WeatherService>(WeatherService);
  });

  describe('getWeather', () => {
    it('should return weather data for a city', async () => {
      const city = 'London';
      const weatherData = { city, temperature: 20, description: 'Sunny' };

      jest.spyOn(service, 'getWeather').mockResolvedValue(weatherData);

      const result = await controller.getWeather(city);
      console.log('Result', result);
      expect(result).toEqual(weatherData);
    });
  });

  describe('getForecast', () => {
    it('should return forecast data for a city', async () => {
      const city = 'London';
      const forecastData = {
        city,
        forcast: [
          { date: '2025-02-10', temperature: 20, description: 'Sunny' },
        ],
      };

      jest.spyOn(service, 'getForecast').mockResolvedValue(forecastData);

      const result = await controller.getForecast(city);
      console.log('Result', result);
      expect(result).toEqual(forecastData);
    });
  });
});
