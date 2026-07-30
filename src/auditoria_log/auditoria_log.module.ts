import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditoriaLogService } from './auditoria_log.service';
import { AuditoriaLogController } from './auditoria_log.controller';
import { AuditoriaLog } from './entities/auditoria_log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuditoriaLog])],
  controllers: [AuditoriaLogController],
  providers: [AuditoriaLogService],
})
export class AuditoriaLogModule {}
