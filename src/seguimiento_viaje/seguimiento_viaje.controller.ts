import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeguimientoViajeService } from './seguimiento_viaje.service';
import { CreateSeguimientoViajeDto } from './dto/create-seguimiento_viaje.dto';
import { UpdateSeguimientoViajeDto } from './dto/update-seguimiento_viaje.dto';

@Controller('seguimiento-viaje')
export class SeguimientoViajeController {
  constructor(private readonly seguimientoViajeService: SeguimientoViajeService) {}

  @Post()
  create(@Body() createSeguimientoViajeDto: CreateSeguimientoViajeDto) {
    return this.seguimientoViajeService.create(createSeguimientoViajeDto);
  }

  @Get()
  findAll() {
    return this.seguimientoViajeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seguimientoViajeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSeguimientoViajeDto: UpdateSeguimientoViajeDto) {
    return this.seguimientoViajeService.update(+id, updateSeguimientoViajeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seguimientoViajeService.remove(+id);
  }
}
