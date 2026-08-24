import { UseGuards,Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, ParseIntPipe, Query } from '@nestjs/common';
import { SolicitudesService } from './solicitudes.service';
import { CreateSolicitudeDto } from './dto/create-solicitude.dto';
import { UpdateSolicitudeDto } from './dto/update-solicitude.dto';
import { AuthService } from 'src/auth/auth.service';
import { SessionGuard } from 'src/auth/session.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Solicitude } from './entities/solicitude.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Estado } from './enums/estado.enum';
import { Tipo } from './enums/tipo.enum';

@Controller('solicitudes')
export class SolicitudesController {
  constructor(private readonly solicitudesService: SolicitudesService) {}

  @Post()
  @UseGuards(SessionGuard)
  @HttpCode(201)
  async create(@Body() createSolicitudeDto: CreateSolicitudeDto) {
    return this.solicitudesService.create(createSolicitudeDto);
  }

  @Get() 
  @UseGuards(SessionGuard)
  async findAll(
  @Query('tipo') tipo?: Tipo,
  @Query('estado') estado?: Estado,
  @Query('receptor_id') receptorId?: string,
) {
  return this.solicitudesService.findAll({
    tipo,
    estado,
    receptorId: receptorId ? Number(receptorId) : undefined,
  });
}

  @Get(':id')
  @UseGuards(SessionGuard)
  findOne(@Param('id') id: string) {
    return this.solicitudesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(SessionGuard)
  update(@Param('id') id: string, @Body() updateSolicitudeDto: UpdateSolicitudeDto) {
    return this.solicitudesService.update(+id, updateSolicitudeDto);
  }

  @Patch(':id/aceptar')
  //@UseGuards(SessionGuard)
  async aceptar(@Param('id', ParseIntPipe) id: number) {
    return this.solicitudesService.aceptar(id);
  }

  @Patch(':id/rechazar')
  @UseGuards(SessionGuard)
  async rechazar(@Param('id', ParseIntPipe) id: number) {
    return this.solicitudesService.rechazar(id);
  }

  @Delete(':id')
  @UseGuards(SessionGuard)
  remove(@Param('id') id: string) {
    return this.solicitudesService.remove(+id);
  }
}
