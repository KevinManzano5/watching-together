import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { envs } from './common/config/envs';

async function bootstrap() {
  const { API_VERSION, PORT } = envs;

  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(`api/${API_VERSION}`);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(PORT);

  logger.log(`App running on port ${PORT}`);
}
bootstrap();
