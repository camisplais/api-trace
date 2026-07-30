import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmbarquesService } from './embarques.service';
import { CreateEmbarqueDto } from './dto/create-embarque.dto';
import { UpdateEmbarqueDto } from './dto/update-embarque.dto';

@Controller('embarques')
export class EmbarquesController {
  constructor(private readonly embarquesService: EmbarquesService) {}

  @Post()
  create(@Body() createEmbarqueDto: CreateEmbarqueDto) {
    return this.embarquesService.create(createEmbarqueDto);
  }

  @Get()
  findAll() {
    return this.embarquesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.embarquesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmbarqueDto: UpdateEmbarqueDto) {
    return this.embarquesService.update(+id, updateEmbarqueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.embarquesService.remove(+id);
  }
}
