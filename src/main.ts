import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exception-filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
  // console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
