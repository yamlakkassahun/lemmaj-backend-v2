import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from '@app/shared';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:5173', 'http://localhost:4201', 'https://lemmaj.com'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Auth API')
    .setDescription('Authentication API with JWT and Cookies')
    .setVersion('1.0')
    .addCookieAuth('access_token', { type: 'http' }) // show cookie auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);


  await app.listen(3000, () => console.log(`Server is ruining on http://localhost:4000/`));
}
bootstrap();
