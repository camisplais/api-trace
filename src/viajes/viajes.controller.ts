
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ViajesService } from './viajes.service';
import { CreateViajeDto } from './dto/create-viaje.dto';
import { UpdateViajeDto } from './dto/update-viaje.dto';
import { FindViajesDto } from './dto/find-viajes.dto';

@Controller('viajes')
export class ViajesController {
  constructor(private readonly viajesService: ViajesService) {}

  @Post()
  create(@Body() createViajeDto: CreateViajeDto) {
    return this.viajesService.create(createViajeDto);
  }

  @Get()
  findAll(@Query() query: FindViajesDto) {
    return this.viajesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.viajesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateViajeDto: UpdateViajeDto) {
    return this.viajesService.update(+id, updateViajeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.viajesService.remove(+id);
  }
}
