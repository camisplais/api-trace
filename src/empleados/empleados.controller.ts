import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { EmpleadosService } from './empleados.service';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { FindEmpleadosDto } from './dto/find-empleados.dto';
import { AppException } from 'src/common/errors/app.exception';

// Foto del empleado: JPG o PNG, max 5MB (mismo criterio que transportes).
const TIPOS_IMAGEN_PERMITIDOS = ['image/jpeg', 'image/png'];
const TAMANO_MAXIMO_IMAGEN = 5 * 1024 * 1024;

const fotoInterceptor = () =>
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

@Controller('empleados')
export class EmpleadosController {
  constructor(private readonly empleadosService: EmpleadosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  importar(@UploadedFile() file: Express.Multer.File) {
    return this.empleadosService.importarArchivo(file);
  }

  @Patch(':id/foto')
  @UseInterceptors(fotoInterceptor())
  actualizarFoto(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() imagen?: Express.Multer.File,
  ) {
    return this.empleadosService.actualizarFoto(id, imagen);
  }

  @Get()
  findAll(@Query() query: FindEmpleadosDto) {
    return this.empleadosService.findAll(query);
  }

    @Get('choferes')
  findChoferes() {
    return this.empleadosService.findChoferes();
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.empleadosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmpleadoDto: UpdateEmpleadoDto) {
    return this.empleadosService.update(+id, updateEmpleadoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.empleadosService.remove(+id);
  }
}
