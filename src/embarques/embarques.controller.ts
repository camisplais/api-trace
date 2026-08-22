import {
  UseGuards,
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
import { AuthService } from 'src/auth/auth.service';
import { SessionGuard } from 'src/auth/session.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('embarques')
export class EmbarquesController {
  constructor(private readonly embarquesService: EmbarquesService,
              private readonly authService: AuthService,
  ) {}

  @Post('import/preview')
  //@UseGuards(SessionGuard)
  @UseInterceptors(FileInterceptor('file'))
  async importarArchivo(@UploadedFile() file: Express.Multer.File) {
    return this.embarquesService.importarArchivo(file);
  }

  @Post('import/confirmar')
  //@UseGuards(SessionGuard)
  @HttpCode(201)
  async confirmarImportacion(@Body() confirmarImportEmbarquesDto: ConfirmarImportEmbarquesDto) {
    const data = await this.embarquesService.confirmarImportacion(confirmarImportEmbarquesDto);
    return data;
  }

  @Get(':id/pruebas-entrega')
  //@UseGuards(SessionGuard)
  async getDocumentosRequeridos(@Param('id', ParseIntPipe) id: number) {
    return this.embarquesService.getDocumentosRequeridos(id);
  }

  @Get(':id/seguimiento')
  //@UseGuards(SessionGuard)
  async getSeguimiento(@Param('id', ParseIntPipe) id: number) {
    return this.embarquesService.getSeguimiento(id);
  }

  @Get()
  //@UseGuards(SessionGuard)
  async findAll(@Query() filtros: FiltroEmbarquesDto) {
    const { data, meta } = await this.embarquesService.findAllFiltrado(filtros);
    return { data, meta, msg:null };
  }
}
