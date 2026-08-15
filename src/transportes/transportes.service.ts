import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transporte, Estado } from './entities/transporte.entity';
import { CreateTransporteDto } from './dto/create-transporte.dto';
import { UpdateTransporteDto } from './dto/update-transporte.dto';
import { FindTransportesDto } from './dto/find-transportes.dto';

@Injectable()
export class TransportesService {
  constructor(
    @InjectRepository(Transporte)
    private readonly transporteRepo: Repository<Transporte>,
  ) {}

  create(createTransporteDto: CreateTransporteDto) {
    return 'This action adds a new transporte';
  }

  async findAll(query: FindTransportesDto) {
    const qb = this.transporteRepo.createQueryBuilder('transporte');

    if (query.estado) {
      qb.andWhere('transporte.estado = :estado', { estado: query.estado });
    }

    qb.orderBy('transporte.id', 'DESC');

    return qb.getMany();
  }

    async findEnPlanta() {
    const transportes = await this.transporteRepo.find({
      where: { estado: Estado.PLANTA },
      order: { placas: 'ASC' },
    });

    return {
      data: transportes.map((transporte) => ({
        id: transporte.id,
        placas: transporte.placas,
        marca: transporte.marca,
        carga_util: transporte.carga_util,
        estado: transporte.estado,
      })),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} transporte`;
  }

  update(id: number, updateTransporteDto: UpdateTransporteDto) {
    return `This action updates a #${id} transporte`;
  }

  remove(id: number) {
    return `This action removes a #${id} transporte`;
  }
}