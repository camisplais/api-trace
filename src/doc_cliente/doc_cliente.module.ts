import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocClienteService } from './doc_cliente.service';
import { DocClienteController } from './doc_cliente.controller';
import { DocCliente } from './entities/doc_cliente.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([DocCliente]),
    AuthModule
  ],
  controllers: [DocClienteController],
  providers: [DocClienteService],
})
export class DocClienteModule {}
