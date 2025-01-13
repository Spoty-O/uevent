import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = app.get('PORT') || 5000;
  await app.listen(PORT || 5000, () =>
    console.log(`Server started on port:${PORT}`),
  );
}
bootstrap();
