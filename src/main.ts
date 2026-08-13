import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { AppException } from './common/errors/app.exception'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        exceptionFactory: (errors: ValidationError[]) => {
        const primer = errors[0];
        const constraints = primer.constraints ?? {};
        const esRequerido =
          'isNotEmpty' in constraints || 'isDefined' in constraints;

        if (esRequerido) {
          return new AppException(
            'VAL_REQUIRED_FIELD',
            `El campo ${primer.property} es obligatorio`,
          );
        }
        return new AppException(
          'VAL_INVALID_FIELD',
          `${primer.property} tiene un valor inválido`,
        );
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();