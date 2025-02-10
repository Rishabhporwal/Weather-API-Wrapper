import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  private weatherApiUrl: string;
  private weatherApiKey: string;
  private readonly cacheTTL = Number(process.env.CACHE_TTL); // Cache expires in 30 mins

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.weatherApiUrl =
      this.configService.get<string>('WEATHER_API_URL') || '';
    this.weatherApiKey =
      this.configService.get<string>('WEATHER_API_KEY') || '';
  }

  async getWeather(city: string): Promise<any> {
    const cacheKey = `weather-${city}`;
    const cachedData = await this.cacheManager.get(cacheKey);

    if (cachedData) {
      this.logger.log(`Cache hit for weather in ${city}`);
      return cachedData;
    }

    this.logger.warn(
      `Cache missed for weather in ${city}, calling external API`,
    );
    const url = `${this.weatherApiUrl}/weather?q=${city}&appid=${this.weatherApiKey}&units=metric`;

    try {
      const response = await this.httpService.axiosRef.get(url);

      if (!response) {
        this.logger.log(`Weather data not found for city: ${city}`);
        throw new NotFoundException(`Weather data not found for city: ${city}`);
      }

      const weatherData = {
        city,
        temperature: response?.data?.main?.temp,
        description: response.data.weather[0].description,
        humidity: response.data.main.humidity,
        windSpeed: response.data.wind.speed,
      };

      await this.cacheManager.set(cacheKey, weatherData, this.cacheTTL);
      this.logger.log(`Cached weather data for ${city}`);

      return weatherData;
    } catch (error) {
      this.logger.error(
        `Failed to fetch weather for ${city}: ${error.message}`,
      );
      throw new NotFoundException(`Failed to fetch weather data for ${city}`);
    }
  }

  async getForecast(city: string): Promise<any> {
    const cacheKey = `forecast-${city}`;
    const cachedData = await this.cacheManager.get(cacheKey);

    if (cachedData) {
      this.logger.log(`Cache hit for forecast in ${city}`);
      return cachedData;
    }

    this.logger.warn(
      `Cache miss for forecast in ${city}, calling external API`,
    );

    const url = `${this.weatherApiUrl}/forecast?q=${city}&appid=${this.weatherApiKey}&units=metric`;
    try {
      const response = await this.httpService.axiosRef.get(url);

      if (!response) {
        this.logger.log(`Forecast data not found for city: ${city}`);
        throw new NotFoundException(`Weather data not found for city: ${city}`);
      }

      const forcastData = response?.data?.list?.slice(0, 5)?.map((item) => ({
        date: item.dt_txt,
        temperature: item.main.temp,
        description: item.weather[0].description,
      }));

      await this.cacheManager.set(cacheKey, forcastData, this.cacheTTL);
      this.logger.log(`Forecast data for ${city} cached successfully`);

      return { city, forcast: forcastData };
    } catch (error) {
      this.logger.error(
        `Failed to fetch forecast for ${city}: ${error.message}`,
      );
      throw new NotFoundException(`Weather data not found for city: ${city}`);
    }
  }
}
