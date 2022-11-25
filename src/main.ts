import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppExceptionHandler } from './common/exceptions';
import { AppConfigService } from './config/app/config.service';
import { exceptionFactory } from './common/utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Providing custom form of validation errors
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new AppExceptionHandler());

  // get app configs
  const appConfig: AppConfigService = app.get(AppConfigService);

  await app.listen(appConfig.port);
}
bootstrap();
