import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmbarquesService } from './embarques.service';
import { EmbarquesController } from './embarques.controller';
import { Embarque } from './entities/embarque.entity';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Embarque, Cliente, Empleado])],
  controllers: [EmbarquesController],
  providers: [EmbarquesService],
})
export class EmbarquesModule {}
