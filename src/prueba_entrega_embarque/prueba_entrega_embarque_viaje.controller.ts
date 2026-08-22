import { Controller, Post, Body, Param, ParseIntPipe, UploadedFile, UseInterceptors, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PruebaEntregaEmbarqueService } from './prueba_entrega_embarque.service';

@Controller('viajes')
export class PruebaEntregaEmbarqueViajeController {
  constructor(private readonly pruebaEntregaEmbarqueService: PruebaEntregaEmbarqueService) {}

  @Post(':viajeEmbarqueId/embarques/:embarqueId/pruebas-entrega')
  @UseInterceptors(FileInterceptor('file'))
  async subirPruebaDesfasada(
    @Param('viajeEmbarqueId', ParseIntPipe) viajeEmbarqueId: number,
    @Param('embarqueId', ParseIntPipe) embarqueId: number,
    @Body('docClienteId', ParseIntPipe) docClienteId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.pruebaEntregaEmbarqueService.subirPruebaDesfasada(
      viajeEmbarqueId,
      embarqueId,
      docClienteId,
      file,
    );
  }

  @Get(':viajeId/embarques-pendientes')
  async findEmbarquesPendientes(@Param('viajeId', ParseIntPipe) viajeId: number) {
  return this.pruebaEntregaEmbarqueService.findEmbarquesPendientesPorViaje(viajeId);
  }
}