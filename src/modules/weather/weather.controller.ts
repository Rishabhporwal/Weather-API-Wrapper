import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Weather')
@ApiBearerAuth() // Requires JWT authentication
@Controller('weather')
@UseGuards(ThrottlerGuard)
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get(':city')
  @ApiOperation({ summary: 'Get current weather for a city' })
  @ApiParam({ name: 'city', description: 'City name', example: 'New York' })
  @Throttle({
    default: {
      limit: parseInt(process.env.RATE_LIMIT_MAX || '30', 10),
      ttl: parseInt(process.env.RATE_LIMIT_TTL || '60', 10),
    },
  })
  async getWeather(@Param('city') city: string) {
    return this.weatherService.getWeather(city);
  }

  @Get('forecast/:city')
  @ApiOperation({ summary: 'Get 5-day weather forecast for a city' })
  @ApiParam({ name: 'city', description: 'City name', example: 'Los Angeles' })
  @Throttle({
    default: {
      limit: parseInt(process.env.RATE_LIMIT_MAX || '30', 10),
      ttl: parseInt(process.env.RATE_LIMIT_TTL || '60', 10),
    },
  })
  async getForecast(@Param('city') city: string) {
    return this.weatherService.getForecast(city);
  }
}
