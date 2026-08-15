// src/database/seeds/main.ts
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from '../../app.module';
import { seedDocumentos } from './seed-documentos';
import { seedClientes } from './seed-clientes';
import { seedDocCliente } from './seed-doc-cliente';
import { seedEmpleados } from './seed-empleados';
import { seedTransportes } from './seed-transportes';
import { seedEmbarques } from './seed-embarques';
import { seedViajes } from './seed-viajes';
import { seedViajeEmbarque } from './seed-viaje-embarque';
import { seedPruebaEntregaEmbarque } from './seed-prueba-entrega-embarque';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    console.log('Ejecutando seeders...');
    await seedDocumentos(dataSource);
    await seedClientes(dataSource);
    await seedEmpleados(dataSource);
    await seedTransportes(dataSource);
    await seedDocCliente(dataSource)
    await seedEmbarques(dataSource);
    await seedViajes(dataSource);
    await seedViajeEmbarque(dataSource);
    await seedPruebaEntregaEmbarque(dataSource);
    console.log('Seed completado');
  } catch (err) {
    console.error('Error en el seed', err);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();