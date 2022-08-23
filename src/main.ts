import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exception-filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      // disableErrorMessages: true,
      // dismissDefaultMessages: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
