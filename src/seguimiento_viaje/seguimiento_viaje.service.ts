import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeguimientoViaje } from './entities/seguimiento_viaje.entity';
import { Empleado } from '../empleados/entities/empleado.entity';
import { CreateSeguimientoViajeDto } from './dto/create-seguimiento_viaje.dto';
import { UpdateSeguimientoViajeDto } from './dto/update-seguimiento_viaje.dto';
import { AppException } from 'src/common/errors/app.exception';

@Injectable()
export class SeguimientoViajeService {
  private readonly EMPLEADO_POR_ASIGNAR_ID = 16;

  constructor(
    @InjectRepository(SeguimientoViaje)
    private readonly seguimientoRepo: Repository<SeguimientoViaje>,
  ) {}

  async obtenerPorViaje(viajeId: number) {
    const seguimiento = await this.seguimientoRepo.findOne({
      where: { viaje: { id: viajeId } },
      relations: {
        empleado_caseta_entrada: true,
        empleado_caseta_salida: true,
        empleado_qr_salida: true,
      },
    });

    if (!seguimiento) {
      throw new AppException('VAL_RECORD_NOT_FOUND', {
        record: 'Seguimiento del viaje',
      });
    }

    return {
      data: {
        hora_salida: seguimiento.salida,
        hora_entrada: seguimiento.entrada,
        empleado_caseta_entrada: this.formatearEmpleado(
          seguimiento.empleado_caseta_entrada,
        ),
        empleado_caseta_salida: this.formatearEmpleado(
          seguimiento.empleado_caseta_salida,
        ),
        empleado_qr_salida: this.formatearEmpleado(
          seguimiento.empleado_qr_salida,
        ),
        qr: seguimiento.qr,
      },
      msg: {
        code: 'OK',
        msg: 'Seguimiento de viaje obtenido con éxito',
      },
    };
  }

  private formatearEmpleado(empleado: Empleado) {
    if (empleado.id === this.EMPLEADO_POR_ASIGNAR_ID) {
      return { estado: 'pendiente', nombre: null };
    }
    return {
      estado: 'asignado',
      nombre: `${empleado.nombre} ${empleado.apellido_paterno}`,
    };
  }

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
