import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EmpleadosService } from './empleados.service';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { FindEmpleadosDto } from './dto/find-empleados.dto';


@Controller('empleados')
export class EmpleadosController {
  constructor(private readonly empleadosService: EmpleadosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  importar(@UploadedFile() file: Express.Multer.File) {
    return this.empleadosService.importarArchivo(file);
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
