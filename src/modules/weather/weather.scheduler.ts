import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Cron } from '@nestjs/schedule';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { WeatherService } from './weather.service';
import { FavoriteService } from '../favorite/favorite.service';

@Injectable()
export class WeatherScheduler {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly favoriteService: FavoriteService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Cron('*/10 * * * *') // Runs every 10 minutes
  async updateWeatherForFavorites() {
    console.log('Running weather update job...');

    const favoriteLocations =
      await this.favoriteService.getAllFavoriteLocations();
    for (const location of favoriteLocations) {
      const updatedWeather = await this.weatherService.getWeather(
        location.city,
      );
      const cacheKey = `weather:${location.city}`;
      await this.cacheManager.set(cacheKey, updatedWeather, 300000);

      console.log(`Updated weather for ${location.city}`);
    }
  }
}
