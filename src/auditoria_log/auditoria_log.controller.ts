import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuditoriaLogService } from './auditoria_log.service';
import { CreateAuditoriaLogDto } from './dto/create-auditoria_log.dto';
import { UpdateAuditoriaLogDto } from './dto/update-auditoria_log.dto';

@Controller('auditoria-log')
export class AuditoriaLogController {
  constructor(private readonly auditoriaLogService: AuditoriaLogService) {}

  @Post()
  create(@Body() createAuditoriaLogDto: CreateAuditoriaLogDto) {
    return this.auditoriaLogService.create(createAuditoriaLogDto);
  }

  @Get()
  findAll() {
    return this.auditoriaLogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auditoriaLogService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuditoriaLogDto: UpdateAuditoriaLogDto) {
    return this.auditoriaLogService.update(+id, updateAuditoriaLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.auditoriaLogService.remove(+id);
  }
}
