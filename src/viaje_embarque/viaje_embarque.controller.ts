import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ViajeEmbarqueService } from './viaje_embarque.service';
import { CreateViajeEmbarqueDto } from './dto/create-viaje_embarque.dto';
import { UpdateViajeEmbarqueDto } from './dto/update-viaje_embarque.dto';

@Controller('viaje-embarque')
export class ViajeEmbarqueController {
  constructor(private readonly viajeEmbarqueService: ViajeEmbarqueService) {}

  @Post()
  create(@Body() createViajeEmbarqueDto: CreateViajeEmbarqueDto) {
    return this.viajeEmbarqueService.create(createViajeEmbarqueDto);
  }

  @Get()
  findAll() {
    return this.viajeEmbarqueService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.viajeEmbarqueService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateViajeEmbarqueDto: UpdateViajeEmbarqueDto) {
    return this.viajeEmbarqueService.update(+id, updateViajeEmbarqueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.viajeEmbarqueService.remove(+id);
  }
}
