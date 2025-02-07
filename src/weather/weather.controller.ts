import { Controller, Get, Param } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get(':city')
  async getWeather(@Param('city') city: string) {
    return await this.weatherService.getWeather(city);
  }

  @Get('forecast/:city')
  async getForecast(@Param('city') city: string) {
    return await this.weatherService.getForecast(city);
  }
}
