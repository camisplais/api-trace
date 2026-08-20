
import {UseGuards, Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query} from '@nestjs/common';
import { ViajesService } from './viajes.service';
import { CrearViajeDto } from './dto/create-viaje.dto';
import { UpdateViajeDto } from './dto/update-viaje.dto';
import { FindViajesDto } from './dto/find-viajes.dto';
import { AgregarEmbarqueDto } from './dto/agregar-embarque.dto';
import { AuthService } from 'src/auth/auth.service';
import { SessionGuard } from 'src/auth/session.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('viajes')
export class ViajesController {
  constructor(private readonly viajesService: ViajesService,
              private readonly authService: AuthService,
  ) {}

  @Post()
  //@UseGuards(SessionGuard)
  async crearViaje(@Body() dto: CrearViajeDto) {
    return this.viajesService.crearViaje(dto);
  }

  //el viaje va en el path y el embrque en el body
   @Post(':id/embarques')
   //@UseGuards(SessionGuard)
  async agregarEmbarque(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AgregarEmbarqueDto,
  ) {
    return this.viajesService.agregarEmbarque(id, dto);
  }

  @Get()
  //@UseGuards(SessionGuard)
  findAll(@Query() query: FindViajesDto) {
    return this.viajesService.findAll(query);
  }

  @Get(':id')
  //@UseGuards(SessionGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.viajesService.findOne(id);
  }

  @Patch(':id')
  //@UseGuards(SessionGuard)
  update(@Param('id') id: string, @Body() updateViajeDto: UpdateViajeDto) {
    return this.viajesService.update(+id, updateViajeDto);
  }

  @Delete(':id')
  //@UseGuards(SessionGuard)
  remove(@Param('id') id: string) {
    return this.viajesService.remove(+id);
  }
}
