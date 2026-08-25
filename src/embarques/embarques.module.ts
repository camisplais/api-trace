import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmbarquesService } from './embarques.service';
import { EmbarquesController } from './embarques.controller';
import { Embarque } from './entities/embarque.entity';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { DocCliente } from 'src/doc_cliente/entities/doc_cliente.entity';
import { ViajeEmbarque } from 'src/viaje_embarque/entities/viaje_embarque.entity';
import { SeguimientoViaje } from 'src/seguimiento_viaje/entities/seguimiento_viaje.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Embarque,
      Cliente,
      Empleado,
      DocCliente,
      ViajeEmbarque,
      SeguimientoViaje,
      Usuario,
    ]),
    AuthModule,
  ],
  controllers: [EmbarquesController],
  providers: [EmbarquesService],
})
export class EmbarquesModule {}
