import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Weather')
@ApiBearerAuth() // Requires JWT authentication
@Controller('weather')
@UseGuards(ThrottlerGuard)
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get(':city')
  @ApiOperation({ summary: 'Get current weather for a city' })
  @ApiParam({ name: 'city', description: 'City name', example: 'New York' })
  async getWeather(@Param('city') city: string) {
    return this.weatherService.getWeather(city);
  }

  @Get('forecast/:city')
  @ApiOperation({ summary: 'Get 5-day weather forecast for a city' })
  @ApiParam({ name: 'city', description: 'City name', example: 'Los Angeles' })
  async getForecast(@Param('city') city: string) {
    return this.weatherService.getForecast(city);
  }
}
