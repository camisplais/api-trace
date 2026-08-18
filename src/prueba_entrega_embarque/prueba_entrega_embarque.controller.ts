import { Controller, Get, Post, Body, Patch, Param,ParseIntPipe, Delete, UploadedFile,UseInterceptors, } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { PruebaEntregaEmbarqueService } from './prueba_entrega_embarque.service';
import { CreatePruebaEntregaEmbarqueDto } from './dto/create-prueba_entrega_embarque.dto';
import { UpdatePruebaEntregaEmbarqueDto } from './dto/update-prueba_entrega_embarque.dto';
import { AppException } from 'src/common/errors/app.exception';

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

  @Get('embarque/:embarqueId')
  async findByEmbarque(@Param('embarqueId', ParseIntPipe) embarqueId: number) {
    return this.pruebaEntregaEmbarqueService.findByEmbarque(embarqueId);
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
