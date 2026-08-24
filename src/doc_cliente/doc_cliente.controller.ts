import { UseGuards,Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DocClienteService } from './doc_cliente.service';
import { CreateDocClienteDto } from './dto/create-doc_cliente.dto';
import { UpdateDocClienteDto } from './dto/update-doc_cliente.dto';
import { SessionGuard } from 'src/auth/session.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('doc-cliente')
export class DocClienteController {
  constructor(private readonly docClienteService: DocClienteService) {}

  @Post()
  @UseGuards(SessionGuard)
  create(@Body() createDocClienteDto: CreateDocClienteDto) {
    return this.docClienteService.create(createDocClienteDto);
  }

  @Get()
  @UseGuards(SessionGuard)
  findAll() {
    return this.docClienteService.findAll();
  }

  @Get(':id')
  @UseGuards(SessionGuard)
  findOne(@Param('id') id: string) {
    return this.docClienteService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(SessionGuard)
  update(@Param('id') id: string, @Body() updateDocClienteDto: UpdateDocClienteDto) {
    return this.docClienteService.update(+id, updateDocClienteDto);
  }

  @Delete(':id')
  @UseGuards(SessionGuard)
  remove(@Param('id') id: string) {
    return this.docClienteService.remove(+id);
  }
}
