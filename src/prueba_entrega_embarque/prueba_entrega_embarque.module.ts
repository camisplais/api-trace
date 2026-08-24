import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PruebaEntregaEmbarqueService } from './prueba_entrega_embarque.service';
import { PruebaEntregaEmbarqueController } from './prueba_entrega_embarque.controller';
import { PruebaEntregaEmbarque } from './entities/prueba_entrega_embarque.entity';
import { Embarque } from 'src/embarques/entities/embarque.entity';
import { DocCliente } from 'src/doc_cliente/entities/doc_cliente.entity';
import { ViajeEmbarque } from 'src/viaje_embarque/entities/viaje_embarque.entity';
import { Solicitude } from 'src/solicitudes/entities/solicitude.entity';
import { PruebaEntregaEmbarqueViajeController } from './prueba_entrega_embarque_viaje.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([PruebaEntregaEmbarque, Embarque, DocCliente, ViajeEmbarque, Solicitude]),
    AuthModule 
  ],
  controllers: [PruebaEntregaEmbarqueController,
    PruebaEntregaEmbarqueViajeController
  ],
  providers: [PruebaEntregaEmbarqueService],
})
export class PruebaEntregaEmbarqueModule {}
