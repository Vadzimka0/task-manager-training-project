import { ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exception-filter/http-exception.filter';
import { ValidationPipe422 } from './common/validation-pipe/validation-pipe422';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(process.env.URL_PREFIX_PATH);
  app.useGlobalPipes(
    new ValidationPipe422({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const options = new DocumentBuilder()
    .setTitle('Task Manager')
    .setDescription("Vadzim Dzianisik's training project at the company Cogniteq")
    .setVersion('0.0.1')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`${process.env.URL_PREFIX_PATH}/swagger`, app, document);

  await app.listen(3000);
  console.log(`Application is running on: ${process.env.URL_HOST}/${process.env.URL_PREFIX_PATH}`);
  console.log(
    `Swagger is running on: ${process.env.URL_HOST}/${process.env.URL_PREFIX_PATH}/swagger`,
  );
}
bootstrap();
