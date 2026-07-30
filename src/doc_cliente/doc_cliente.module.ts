import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocClienteService } from './doc_cliente.service';
import { DocClienteController } from './doc_cliente.controller';
import { DocCliente } from './entities/doc_cliente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocCliente])],
  controllers: [DocClienteController],
  providers: [DocClienteService],
})
export class DocClienteModule {}
