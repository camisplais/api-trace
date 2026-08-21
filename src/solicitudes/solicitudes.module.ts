import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolicitudesService } from './solicitudes.service';
import { SolicitudesController } from './solicitudes.controller';
import { Solicitude } from './entities/solicitude.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { ViajeEmbarque } from 'src/viaje_embarque/entities/viaje_embarque.entity';
import { WhatsappModule } from 'src/common/whatsapp/whatsapp.module';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Notificacion } from 'src/notificaciones/entities/notificacione.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Solicitude, ViajeEmbarque, Empleado, Usuario, Notificacion]), 
  WhatsappModule,],
  controllers: [SolicitudesController],
  providers: [SolicitudesService],
})
export class SolicitudesModule {}
