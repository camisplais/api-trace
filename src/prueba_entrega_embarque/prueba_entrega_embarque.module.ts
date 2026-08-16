import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PruebaEntregaEmbarqueService } from './prueba_entrega_embarque.service';
import { PruebaEntregaEmbarqueController } from './prueba_entrega_embarque.controller';
import { PruebaEntregaEmbarque } from './entities/prueba_entrega_embarque.entity';
import { Embarque } from 'src/embarques/entities/embarque.entity';
import { DocCliente } from 'src/doc_cliente/entities/doc_cliente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PruebaEntregaEmbarque, Embarque, DocCliente])],
  controllers: [PruebaEntregaEmbarqueController],
  providers: [PruebaEntregaEmbarqueService],
})
export class PruebaEntregaEmbarqueModule {}
