import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeguimientoViajeService } from './seguimiento_viaje.service';
import { SeguimientoViajeController } from './seguimiento_viaje.controller';
import { SeguimientoViaje } from './entities/seguimiento_viaje.entity';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports: [TypeOrmModule.forFeature([SeguimientoViaje]),
    AuthModule
  ],
  controllers: [SeguimientoViajeController],
  providers: [SeguimientoViajeService],
})
export class SeguimientoViajeModule {}
