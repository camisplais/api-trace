import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { AppException } from './common/errors/app.exception';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:5000',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const primer = errors[0];
        const constraints = primer.constraints ?? {};
        const esRequerido =
          'isNotEmpty' in constraints || 'isDefined' in constraints;

        if (esRequerido) {
          return new AppException('VAL_REQUIRED_FIELD', {
          fieldName: primer.property,
        });
        }
        return new AppException('VAL_INVALID_FIELD', {
          fieldName: primer.property,
        });
      },
    }),
  );
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();