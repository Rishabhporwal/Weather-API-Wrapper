import { Resolver, Query, Args } from '@nestjs/graphql';
import { WeatherService } from './weather.service';
import { WeatherDto } from './dto/weather.dto';

@Resolver(() => WeatherDto)
export class WeatherResolver {
  constructor(private readonly weatherService: WeatherService) {}

  @Query(() => WeatherDto, { name: 'getWeather' })
  async getWeather(@Args('city') city: string): Promise<WeatherDto> {
    return this.weatherService.getWeather(city);
  }

  @Query(() => [WeatherDto], { name: 'getForecast' })
  async getForecast(@Args('city') city: string): Promise<WeatherDto[]> {
    return this.weatherService.getForecast(city);
  }
}
