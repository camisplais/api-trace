import 'dotenv/config';
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
  origin: [process.env.FRONT_URL, process.env.ADMIN_URL],
  credentials: true,
})
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const miprimer = errors[0];
        const constraints = miprimer.constraints ?? {};
        const esRequerido =
          'isNotEmpty' in constraints || 'isDefined' in constraints;

        if (esRequerido) {
          return new AppException('VAL_REQUIRED_FIELD', {
          fieldName: miprimer.property,
        });
        }
        return new AppException('VAL_INVALID_FIELD', {
          fieldName: miprimer.property,
        });
      },
    }),
  );
  await app.listen(process.env.PORT ?? 4000,process.env.HOST ??'192.168.1.12');
}
bootstrap();