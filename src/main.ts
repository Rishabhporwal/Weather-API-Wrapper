import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLogger } from './logger/logger.service';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(CustomLogger);
  dotenv.config();
  app.useLogger(logger);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
