import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { WeatherResolver } from './weather.resolver';
import { CacheModule } from '@nestjs/cache-manager';


@Module({
  imports: [HttpModule, ConfigModule, CacheModule.register()],
  controllers: [WeatherController],
  providers: [WeatherService, WeatherResolver],
})
export class WeatherModule {}
