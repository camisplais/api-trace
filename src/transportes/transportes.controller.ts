import {
  UseGuards,
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
import { AuthService } from 'src/auth/auth.service';
import { SessionGuard } from 'src/auth/session.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

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
@UseGuards(SessionGuard)
export class TransportesController {
  constructor(private readonly transportesService: TransportesService) {}

  @Post()
  @UseGuards(SessionGuard)
  @UseInterceptors(imagenInterceptor())
  create(
    @Body() createTransporteDto: CreateTransporteDto,
    @UploadedFile() imagen?: Express.Multer.File,
  ) {
    return this.transportesService.create(createTransporteDto, imagen);
  }

  @Get()
  @UseGuards(SessionGuard)
  findAll(@Query() query: FindTransportesDto) {
    return this.transportesService.findAll(query);
  }

  @Get('planta')
  @UseGuards(SessionGuard)
  findEnPlanta() {
    return this.transportesService.findEnPlanta();
  }

  @Get(':id')
  @UseGuards(SessionGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.transportesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(SessionGuard)
  @UseInterceptors(imagenInterceptor())
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransporteDto: UpdateTransporteDto,
    @UploadedFile() imagen?: Express.Multer.File,
  ) {
    return this.transportesService.update(id, updateTransporteDto, imagen);
  }

  @Delete(':id')
  @UseGuards(SessionGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.transportesService.remove(id);
  }
}