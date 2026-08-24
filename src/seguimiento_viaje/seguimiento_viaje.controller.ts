import { UseGuards,Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { SeguimientoViajeService } from './seguimiento_viaje.service';
import { CreateSeguimientoViajeDto } from './dto/create-seguimiento_viaje.dto';
import { UpdateSeguimientoViajeDto } from './dto/update-seguimiento_viaje.dto';
import { AuthService } from 'src/auth/auth.service';
import { SessionGuard } from 'src/auth/session.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('seguimiento-viaje')
export class SeguimientoViajeController {
  constructor(private readonly seguimientoViajeService: SeguimientoViajeService) {}

  @Post()
  @UseGuards(SessionGuard)
  create(@Body() createSeguimientoViajeDto: CreateSeguimientoViajeDto) {
    return this.seguimientoViajeService.create(createSeguimientoViajeDto);
  }

  @Get('viaje/:viajeId')
  @UseGuards(SessionGuard)
  async obtenerPorViaje(@Param('viajeId', ParseIntPipe) viajeId: number) {
    return this.seguimientoViajeService.obtenerPorViaje(viajeId);
  }

  @Get(':id')
  @UseGuards(SessionGuard)
  findOne(@Param('id') id: string) {
    return this.seguimientoViajeService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(SessionGuard)
  update(@Param('id') id: string, @Body() updateSeguimientoViajeDto: UpdateSeguimientoViajeDto) {
    return this.seguimientoViajeService.update(+id, updateSeguimientoViajeDto);
  }

  @Delete(':id')
  @UseGuards(SessionGuard)
  remove(@Param('id') id: string) {
    return this.seguimientoViajeService.remove(+id);
  }
}
