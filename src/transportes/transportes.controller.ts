import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { TransportesService } from './transportes.service';
import { CreateTransporteDto } from './dto/create-transporte.dto';
import { UpdateTransporteDto } from './dto/update-transporte.dto';
import { FindTransportesDto } from './dto/find-transportes.dto';
import { AppException } from 'src/common/errors/app.exception';

// Imagen del transporte: JPG o PNG, max 5MB (segun diseno)
const TIPOS_IMAGEN_PERMITIDOS = ['image/jpeg', 'image/png'];
const TAMANO_MAXIMO_IMAGEN = 5 * 1024 * 1024;

const imagenInterceptor = () =>
  FileInterceptor('imagen', {
    storage: memoryStorage(),
    limits: { fileSize: TAMANO_MAXIMO_IMAGEN },
    fileFilter: (req, file, callback) => {
      if (!TIPOS_IMAGEN_PERMITIDOS.includes(file.mimetype)) {
        return callback(new AppException('FILE_INVALID_TYPE'), false);
      }
      callback(null, true);
    },
  });

@Controller('transportes')
export class TransportesController {
  constructor(private readonly transportesService: TransportesService) {}

  @Post()
  @UseInterceptors(imagenInterceptor())
  create(
    @Body() createTransporteDto: CreateTransporteDto,
    @UploadedFile() imagen?: Express.Multer.File,
  ) {
    return this.transportesService.create(createTransporteDto, imagen);
  }

  @Get()
  findAll(@Query() query: FindTransportesDto) {
    return this.transportesService.findAll(query);
  }

  @Get('planta')
  findEnPlanta() {
    return this.transportesService.findEnPlanta();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.transportesService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(imagenInterceptor())
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransporteDto: UpdateTransporteDto,
    @UploadedFile() imagen?: Express.Multer.File,
  ) {
    return this.transportesService.update(id, updateTransporteDto, imagen);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.transportesService.remove(id);
  }
}