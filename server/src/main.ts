import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const config = app.get(ConfigService);
  const PORT = config.get('PORT') || 5000;
  await app.listen(PORT || 5000, () =>
    console.log(`Server started on port:${PORT}`),
  );
}
bootstrap();
