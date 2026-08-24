import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransportesService } from './transportes.service';
import { TransportesController } from './transportes.controller';
import { Transporte } from './entities/transporte.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transporte]),
    AuthModule
  ],
  controllers: [TransportesController],
  providers: [TransportesService],
})
export class TransportesModule {}
