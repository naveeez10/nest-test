import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilterFilter } from './allExceptionsFilter.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilterFilter(app.get(HttpAdapterHost)));
  await app.listen(3000);
}
bootstrap();
