import { Resolver, Query, Args } from '@nestjs/graphql';
import { WeatherService } from './weather.service';

@Resolver()
export class WeatherResolver {
  constructor(private readonly weatherService: WeatherService) {}

  @Query(() => String)
  async getWeather(@Args('city') city: string) {
    return await this.weatherService.getWeather(city);
  }

  @Query(() => String)
  async getForecast(@Args('city') city: string) {
    return await this.weatherService.getForecast(city);
  }
}
