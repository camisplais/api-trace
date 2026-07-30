import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PruebaEntregaEmbarqueService } from './prueba_entrega_embarque.service';
import { PruebaEntregaEmbarqueController } from './prueba_entrega_embarque.controller';
import { PruebaEntregaEmbarque } from './entities/prueba_entrega_embarque.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PruebaEntregaEmbarque])],
  controllers: [PruebaEntregaEmbarqueController],
  providers: [PruebaEntregaEmbarqueService],
})
export class PruebaEntregaEmbarqueModule {}
