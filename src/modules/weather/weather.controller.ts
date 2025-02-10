import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('weather')
@UseGuards(ThrottlerGuard)
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get(':city')
  async getWeather(@Param('city') city: string) {
    return this.weatherService.getWeather(city);
  }

  @Get('forecast/:city')
  async getForecast(@Param('city') city: string) {
    return this.weatherService.getForecast(city);
  }
}
