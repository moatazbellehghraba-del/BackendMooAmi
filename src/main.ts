import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Global request Balidation 
  app.useGlobalPipes(new ValidationPipe({whitelist:true , forbidNonWhitelisted: true, // throws an error if extra fields are sent
    transform: true,  }))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
