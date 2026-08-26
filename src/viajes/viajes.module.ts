import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViajesService } from './viajes.service';
import { ViajesController } from './viajes.controller';
import { Viaje } from './entities/viaje.entity';
import { ViajeEmbarque } from 'src/viaje_embarque/entities/viaje_embarque.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { Transporte } from 'src/transportes/entities/transporte.entity';
import { Embarque } from 'src/embarques/entities/embarque.entity';
import { SeguimientoViaje } from 'src/seguimiento_viaje/entities/seguimiento_viaje.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Viaje, ViajeEmbarque, Empleado, Transporte, Embarque, SeguimientoViaje, Usuario]),
    AuthModule
  ],
  controllers: [ViajesController],
  providers: [ViajesService],
})
export class ViajesModule {}
