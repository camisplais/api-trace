import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PruebaEntregaEmbarqueService } from './prueba_entrega_embarque.service';
import { CreatePruebaEntregaEmbarqueDto } from './dto/create-prueba_entrega_embarque.dto';
import { UpdatePruebaEntregaEmbarqueDto } from './dto/update-prueba_entrega_embarque.dto';

@Controller('prueba-entrega-embarque')
export class PruebaEntregaEmbarqueController {
  constructor(private readonly pruebaEntregaEmbarqueService: PruebaEntregaEmbarqueService) {}

  @Post()
  create(@Body() createPruebaEntregaEmbarqueDto: CreatePruebaEntregaEmbarqueDto) {
    return this.pruebaEntregaEmbarqueService.create(createPruebaEntregaEmbarqueDto);
  }

  @Get()
  findAll() {
    return this.pruebaEntregaEmbarqueService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pruebaEntregaEmbarqueService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePruebaEntregaEmbarqueDto: UpdatePruebaEntregaEmbarqueDto) {
    return this.pruebaEntregaEmbarqueService.update(+id, updatePruebaEntregaEmbarqueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pruebaEntregaEmbarqueService.remove(+id);
  }
}
