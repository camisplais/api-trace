import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QRController } from './qr.controller';
import { QRService } from './qr.service';
import { Viaje } from '../viajes/entities/viaje.entity';
import { SeguimientoViaje } from '../seguimiento_viaje/entities/seguimiento_viaje.entity';
import { Empleado } from '../empleados/entities/empleado.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Viaje, SeguimientoViaje, Empleado, Usuario]),
    AuthModule,
  ],
  controllers: [QRController],
  providers: [QRService],
})
export class QRModule {}