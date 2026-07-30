import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransportesService } from './transportes.service';
import { CreateTransporteDto } from './dto/create-transporte.dto';
import { UpdateTransporteDto } from './dto/update-transporte.dto';

@Controller('transportes')
export class TransportesController {
  constructor(private readonly transportesService: TransportesService) {}

  @Post()
  create(@Body() createTransporteDto: CreateTransporteDto) {
    return this.transportesService.create(createTransporteDto);
  }

  @Get()
  findAll() {
    return this.transportesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transportesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransporteDto: UpdateTransporteDto) {
    return this.transportesService.update(+id, updateTransporteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transportesService.remove(+id);
  }
}
