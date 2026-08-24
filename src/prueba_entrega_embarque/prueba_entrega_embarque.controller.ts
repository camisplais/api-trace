import {UseGuards,Controller, Get, Post, Body, Patch, Param,ParseIntPipe, Delete, UploadedFile,UseInterceptors, Query} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { PruebaEntregaEmbarqueService } from './prueba_entrega_embarque.service';
import { CreatePruebaEntregaEmbarqueDto } from './dto/create-prueba_entrega_embarque.dto';
import { UpdatePruebaEntregaEmbarqueDto } from './dto/update-prueba_entrega_embarque.dto';
import { AppException } from 'src/common/errors/app.exception';
import { FiltroPruebasDto } from './dto/filtro-prueba.dto';
import { SessionGuard } from 'src/auth/session.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';


const TIPOS_PERMITIDOS = [
  'application/pdf',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'image/jpeg',
  'image/png',
];

const TAMANO_MAXIMO = 10 * 1024 * 1024; 

@Controller('prueba-entrega-embarque')
export class PruebaEntregaEmbarqueController {
  constructor(private readonly pruebaEntregaEmbarqueService: PruebaEntregaEmbarqueService) {}

  @Post(':embarqueId/:docClienteId')
  @UseGuards(SessionGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: TAMANO_MAXIMO },
      fileFilter: (req, file, callback) => {
        if (!TIPOS_PERMITIDOS.includes(file.mimetype)) {
          return callback(
            new AppException('FILE_INVALID_TYPE_'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  create(
    @Param('embarqueId', ParseIntPipe) embarqueId: number,
    @Param('docClienteId', ParseIntPipe) docClienteId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.pruebaEntregaEmbarqueService.create(
      embarqueId,
      docClienteId,
      file,
    );
  }

  @Get('pendientes')
  @UseGuards(SessionGuard) 
  findEmbarquesPendientesGlobal() {
    return this.pruebaEntregaEmbarqueService.findEmbarquesPendientesGlobal();
  }

  //navegacion aduanas
  @Get('listar-documentos')
  @UseGuards(SessionGuard)
  listarDocumentos(@Query() filtros: FiltroPruebasDto) {
    return this.pruebaEntregaEmbarqueService.listarDocumentos(filtros);
  }

  @Get('embarque/:embarqueId')
  @UseGuards(SessionGuard)
  async findByEmbarque(@Param('embarqueId', ParseIntPipe) embarqueId: number) {
    return this.pruebaEntregaEmbarqueService.findByEmbarque(embarqueId);
  }
  
  @Get('embarque/:embarqueId/faltantes')
  @UseGuards(SessionGuard)
  async findDocumentosFaltantes(@Param('embarqueId', ParseIntPipe) embarqueId: number) {
    return this.pruebaEntregaEmbarqueService.findDocsFaltantesPorEmbarque(embarqueId);
  }
  @Get()
  @UseGuards(SessionGuard)
  findAll() {
    return this.pruebaEntregaEmbarqueService.findAll();
  }

  @Get(':id')
  @UseGuards(SessionGuard)
  findOne(@Param('id') id: string) {
    return this.pruebaEntregaEmbarqueService.findOne(+id);
  }

  //navegacion aduanas
  @Get(':id/url')
  @UseGuards(SessionGuard)
  obtenerUrl(@Param('id', ParseIntPipe) id: number) {
    return this.pruebaEntregaEmbarqueService.obtenerUrlDescarga(id);
  }

  @Patch(':id')
  @UseGuards(SessionGuard)
  update(@Param('id') id: string, @Body() updatePruebaEntregaEmbarqueDto: UpdatePruebaEntregaEmbarqueDto) {
    return this.pruebaEntregaEmbarqueService.update(+id, updatePruebaEntregaEmbarqueDto);
  }

  @Delete(':id')
  @UseGuards(SessionGuard)
  remove(@Param('id') id: string) {
    return this.pruebaEntregaEmbarqueService.remove(+id);
  }

}
