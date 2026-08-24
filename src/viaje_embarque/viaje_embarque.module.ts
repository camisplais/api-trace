import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViajeEmbarqueService } from './viaje_embarque.service';
import { ViajeEmbarqueController } from './viaje_embarque.controller';
import { ViajeEmbarque } from './entities/viaje_embarque.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ViajeEmbarque]),
    AuthModule
  ],
  controllers: [ViajeEmbarqueController],
  providers: [ViajeEmbarqueService],
})
export class ViajeEmbarqueModule {}
