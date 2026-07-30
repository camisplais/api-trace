import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmbarquesService } from './embarques.service';
import { EmbarquesController } from './embarques.controller';
import { Embarque } from './entities/embarque.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Embarque])],
  controllers: [EmbarquesController],
  providers: [EmbarquesService],
})
export class EmbarquesModule {}
