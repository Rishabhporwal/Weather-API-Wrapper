import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { FavoriteModule } from './modules/favorite/favorite.module';
import { WeatherModule } from './modules/weather/weather.module';
import { AuthModule } from './modules/auth/auth.module';
import { CustomLogger } from './logger/logger.service';
import { Favorite } from './modules/favorite/entities/favorite.entity';
import { User } from './modules/auth/entities/user.entity';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { WeatherUpdateJob } from './job/weather-update.job';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // Auto-generate schema
      sortSchema: true,
      context: ({ req }) => ({ req }),
    }),
    ScheduleModule.forRoot(), // Enable Task Scheduling
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASS'),
        database: configService.get('DB_NAME'),
        entities: [Favorite, User],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT || '6379'),
      ttl: Number(process.env.CACHE_TTL), // Cache expires in 30 mins
    }),
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.RATE_LIMIT_TTL || '60', 10),
        limit: parseInt(process.env.RATE_LIMIT_MAX || '30', 10),
      },
    ]),
    WeatherModule,
    AuthModule,
    FavoriteModule,
  ],
  providers: [
    CustomLogger,
    WeatherUpdateJob,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [CustomLogger],
})
export class AppModule {}
