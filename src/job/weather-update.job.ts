import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WeatherService } from './../modules/weather/weather.service';
import { FavoriteService } from './../modules/favorite/favorite.service';

@Injectable()
export class WeatherUpdateJob {
  private readonly logger = new Logger(WeatherUpdateJob.name);

  constructor(
    private readonly weatherService: WeatherService,
    private readonly favoritesService: FavoriteService,
  ) {}

  // Runs every 30 minutes
  @Cron(CronExpression.EVERY_30_MINUTES)
  async updateWeatherForFavorites() {
    this.logger.log('Starting weather update job...');

    try {
      const favorites = await this.favoritesService.getAllFavoriteLocations();

      if (favorites.length === 0) {
        this.logger.log('No favorite locations found.');
        return;
      }

      for (const location of favorites) {
        this.logger.log(`Updating weather for: ${location.city}`);

        try {
          const weatherData = await this.weatherService.getWeather(
            location.city,
          );
          this.logger.log(
            `Updated weather for ${location.city}: ${JSON.stringify(weatherData)}`,
          );
        } catch (error) {
          this.logger.error(
            `Error updating weather for ${location.city}: ${error.message}`,
          );
        }
      }
    } catch (error) {
      this.logger.error(`Weather update job failed: ${error.message}`);
    }
  }
}
