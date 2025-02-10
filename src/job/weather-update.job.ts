import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { WeatherService } from '../modules/weather/weather.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from '../modules/favorite/entities/favorite.entity';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class WeatherUpdateJob {
  private readonly logger = new Logger(WeatherUpdateJob.name);

  constructor(
    private readonly weatherService: WeatherService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
  ) {}

  @Cron('0/30 * * * * *') // Runs every 30 minutes
  async updateWeatherData() {
    this.logger.log('Updating weather data for favorite locations...');

    const favoriteLocations = await this.favoriteRepository.find({
      relations: ['user'],
    });

    for (const favorite of favoriteLocations) {
      try {
        const weatherData = await this.weatherService.getWeather(favorite.city);
        await this.cacheManager.set(
          `weather_${favorite.city}`,
          weatherData,
          Number(process.env.CACHE_TTL),
        ); // Cache for 30 minutes
        this.logger.log(`Updated weather for ${favorite.city}`);
      } catch (error) {
        this.logger.error(
          `Failed to update weather for ${favorite.city}: ${error.message}`,
        );
      }
    }
  }
}
