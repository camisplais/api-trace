import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViajeEmbarqueService } from './viaje_embarque.service';
import { ViajeEmbarqueController } from './viaje_embarque.controller';
import { ViajeEmbarque } from './entities/viaje_embarque.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ViajeEmbarque])],
  controllers: [ViajeEmbarqueController],
  providers: [ViajeEmbarqueService],
})
export class ViajeEmbarqueModule {}
