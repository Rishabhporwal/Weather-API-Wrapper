import { ConfigService } from '@nestjs/config';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
// import { CacheService } from '../cache/cache.service';
import { lastValueFrom } from 'rxjs';

export class WeatherService {
  private readonly API_KEY: string;
  private readonly API_URL: string;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    // private cacheService: CacheService
  ) {
    this.API_KEY = this.configService.get<string>('OPENWEATHER_API_KEY') || '';
    this.API_URL = this.configService.get<string>('OPENWEATHER_BASE_URL') || '';
  }

  async getWeather(city: string) {
    const cachedWeather = null; // await this.cacheService.get(city);
    if (cachedWeather) {
      return cachedWeather;
    }

    try {
      const url = `${this.API_URL}/weather?q=${city}&appid=${this.API_KEY}`;
      const response = await lastValueFrom(this.httpService.get(url));
      const data = response.data;
      // this.cacheService.set(city, data, 3600); // cache for 1 hour
      return data;
    } catch (error) {
      throw new HttpException(
        error.response.data.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getForecast(city: string) {
    const cachedForecast = null; // await this.cacheService.get(city);
    if (cachedForecast) {
      return cachedForecast;
    }

    const url = `${this.API_URL}/forecast?q=${city}&appid=${this.API_KEY}`;
    try {
      const response = await lastValueFrom(this.httpService.get(url));
      const data = response.data;
      // this.cacheService.set(city, data, 3600); // cache for 1 hour
      return data;
    } catch (error) {
      throw new HttpException(
        error.response.data.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
