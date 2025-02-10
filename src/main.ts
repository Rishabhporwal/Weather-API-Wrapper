import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLogger } from './logger/logger.service';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(CustomLogger);
  dotenv.config();
  app.useLogger(logger);
  app.use(helmet());
  app.enableCors()
  app.useGlobalGuards(app.get(ThrottlerGuard));

  // Enable global validation
  app.useGlobalPipes(new ValidationPipe());

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Weather API Wrapper')
    .setDescription('API documentation for Weather & Favorites modules')
    .setVersion('1.0')
    .addBearerAuth() // Enable JWT authentication in Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // Swagger UI at /api/docs

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
