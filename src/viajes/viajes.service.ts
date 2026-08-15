import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Viaje } from './entities/viaje.entity';
import { CreateViajeDto } from './dto/create-viaje.dto';
import { UpdateViajeDto } from './dto/update-viaje.dto';
import { FindViajesDto } from './dto/find-viajes.dto';
import { AppException } from 'src/common/errors/app.exception';

@Injectable()
export class ViajesService {
  constructor(
    @InjectRepository(Viaje)
    private readonly viajeRepo: Repository<Viaje>,
  ) {}

  create(createViajeDto: CreateViajeDto) {
    return 'This action adds a new viaje';
  }

  async findAll(query: FindViajesDto) {
    const page = Number(query.page) || 1;
    const perPage = Number(query.per_page) || 20;

    const idQb = this.viajeRepo
      .createQueryBuilder('viaje')
      .leftJoin('viaje.empleado_chofer', 'empleado_chofer')
      .leftJoin('viaje.transporte', 'transporte')
      .select('viaje.id', 'id');

    if (query.empleado_chofer_id) {
      idQb.andWhere('empleado_chofer.id = :choferId', {
        choferId: Number(query.empleado_chofer_id),
      });
    }

    if (query.transporte_id) {
      idQb.andWhere('transporte.id = :transporteId', {
        transporteId: Number(query.transporte_id),
      });
    }

    const total = await idQb.getCount();

    const rows = await idQb
      .orderBy('viaje.id', 'DESC')
      .skip((page - 1) * perPage)
      .take(perPage)
      .getRawMany();

    const ids = rows.map((row) => row.id);

    const viajes = ids.length
      ? await this.viajeRepo
          .createQueryBuilder('viaje')
          .leftJoinAndSelect('viaje.empleado_chofer', 'empleado_chofer')
          .leftJoinAndSelect('viaje.empleado_embarque', 'empleado_embarque')
          .leftJoinAndSelect('viaje.transporte', 'transporte')
          .leftJoinAndSelect('viaje.viajeEmbarques', 'viajeEmbarque')
          .leftJoinAndSelect('viajeEmbarque.embarque', 'embarque')
          .where('viaje.id IN (:...ids)', { ids })
          .orderBy('viaje.id', 'DESC')
          .getMany()
      : [];

    return {
      data: viajes.map((viaje) => this.formatViaje(viaje)),
      meta: {
        total,
        page,
        per_page: perPage,
        last_page: Math.ceil(total / perPage) || 1,
      },
      msg: {
        code: 'OK',
        msg: 'Lista de viajes',
      },
    };
  }

  async findOne(id: number) {
    const viaje = await this.viajeRepo.findOne({
      where: { id },
      relations: {
        empleado_chofer: true,
        empleado_embarque: true,
        transporte: true,
        viajeEmbarques: { embarque: true },
      },
    });

    if (!viaje) {
      throw new AppException('VAL_RECORD_NOT_FOUND', { record: 'Viaje' });
    }

    return {
      data: this.formatViaje(viaje),
      msg: {
        code: 'OK',
        msg: 'Viaje encontrado',
      },
    };
  }

  update(id: number, updateViajeDto: UpdateViajeDto) {
    return `This action updates a #${id} viaje`;
  }

  remove(id: number) {
    return `This action removes a #${id} viaje`;
  }

  private formatViaje(viaje: Viaje) {
    const viajeEmbarques = viaje.viajeEmbarques ?? [];

    return {
      id: viaje.id,
      empleado_chofer_id: viaje.empleado_chofer?.id,
      empleado_chofer: viaje.empleado_chofer,
      empleado_embarques_id: viaje.empleado_embarque?.id,
      empleado_embarques: viaje.empleado_embarque,
      transporte_id: viaje.transporte?.id,
      transporte: viaje.transporte,
      viaje_embarques: viajeEmbarques.map((ve) => ({
        id: ve.id,
        viaje_id: viaje.id,
        embarque_id: ve.embarque?.id,
        embarque: ve.embarque,
      })),
      embarques: viajeEmbarques.map((ve) => ve.embarque),
    };
  }
}
