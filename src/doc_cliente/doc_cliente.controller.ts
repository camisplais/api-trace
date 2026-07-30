import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DocClienteService } from './doc_cliente.service';
import { CreateDocClienteDto } from './dto/create-doc_cliente.dto';
import { UpdateDocClienteDto } from './dto/update-doc_cliente.dto';

@Controller('doc-cliente')
export class DocClienteController {
  constructor(private readonly docClienteService: DocClienteService) {}

  @Post()
  create(@Body() createDocClienteDto: CreateDocClienteDto) {
    return this.docClienteService.create(createDocClienteDto);
  }

  @Get()
  findAll() {
    return this.docClienteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.docClienteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocClienteDto: UpdateDocClienteDto) {
    return this.docClienteService.update(+id, updateDocClienteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.docClienteService.remove(+id);
  }
}
