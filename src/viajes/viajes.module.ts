import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViajesService } from './viajes.service';
import { ViajesController } from './viajes.controller';
import { Viaje } from './entities/viaje.entity';
import { ViajeEmbarque } from 'src/viaje_embarque/entities/viaje_embarque.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { Transporte } from 'src/transportes/entities/transporte.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Viaje, ViajeEmbarque, Empleado, Transporte])],
  controllers: [ViajesController],
  providers: [ViajesService],
})
export class ViajesModule {}
