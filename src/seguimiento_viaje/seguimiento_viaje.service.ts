import { Injectable } from '@nestjs/common';
import { CreateSeguimientoViajeDto } from './dto/create-seguimiento_viaje.dto';
import { UpdateSeguimientoViajeDto } from './dto/update-seguimiento_viaje.dto';

@Injectable()
export class SeguimientoViajeService {
  create(createSeguimientoViajeDto: CreateSeguimientoViajeDto) {
    return 'This action adds a new seguimientoViaje';
  }

  findAll() {
    return `This action returns all seguimientoViaje`;
  }

  findOne(id: number) {
    return `This action returns a #${id} seguimientoViaje`;
  }

  update(id: number, updateSeguimientoViajeDto: UpdateSeguimientoViajeDto) {
    return `This action updates a #${id} seguimientoViaje`;
  }

  remove(id: number) {
    return `This action removes a #${id} seguimientoViaje`;
  }
}
