import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { InternalServerErrorException } from './filter/internal-server-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new InternalServerErrorException(httpAdapter));

  await app.listen(3000, () => {
    console.log('NestJS Server is listening at 3000 🚀');
  });
}
bootstrap();
