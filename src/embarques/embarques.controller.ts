import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  Body,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EmbarquesService } from './embarques.service';
import { ConfirmarImportEmbarquesDto } from './dto/confirmar-import-embarques.dto';
import { FiltroEmbarquesDto } from './dto/filtro-embarques.dto';

@Controller('embarques')
export class EmbarquesController {
  constructor(private readonly embarquesService: EmbarquesService) {}

  @Post('import/preview')
  @UseInterceptors(FileInterceptor('file'))
  async importarArchivo(@UploadedFile() file: Express.Multer.File) {
    return this.embarquesService.importarArchivo(file);
  }

  @Post('import/confirmar')
  @HttpCode(201)
  async confirmarImportacion(@Body() confirmarImportEmbarquesDto: ConfirmarImportEmbarquesDto) {
    const data = await this.embarquesService.confirmarImportacion(confirmarImportEmbarquesDto);
    return data;
  }

  @Get(':id/pruebas-entrega')
  async getDocumentosRequeridos(@Param('id', ParseIntPipe) id: number) {
    return this.embarquesService.getDocumentosRequeridos(id);
  }

  @Get()
  async findAll(@Query() filtros: FiltroEmbarquesDto) {
    const { data, meta } = await this.embarquesService.findAllFiltrado(filtros);
    return { data, meta, msg:null };
  }
}