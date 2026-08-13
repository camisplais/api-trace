import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empleado } from './entities/empleado.entity';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { FindEmpleadosDto } from './dto/find-empleados.dto';

@Injectable()
export class EmpleadosService {
  constructor(
    @InjectRepository(Empleado)
    private readonly empleadoRepo: Repository<Empleado>,
  ) {}

  create(createEmpleadoDto: CreateEmpleadoDto) {
    return 'This action adds a new empleado';
  }

  async findAll(query: FindEmpleadosDto) {
    const page = Number(query.page) || 1;
    const perPage = Number(query.per_page) || 20;

    const qb = this.empleadoRepo.createQueryBuilder('empleado');

    if (query.departamento) {
      qb.andWhere('empleado.departamento = :departamento', {
        departamento: query.departamento,
      });
    }

    if (query.estado) {
      qb.andWhere('empleado.estado = :estado', { estado: query.estado });
    }

    qb.orderBy('empleado.id', 'DESC')
      .skip((page - 1) * perPage)
      .take(perPage);

    const [empleados, total] = await qb.getManyAndCount();

    return {
      data: empleados,
      meta: {
        total,
        page,
        per_page: perPage,
        last_page: Math.ceil(total / perPage) || 1,
      },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} empleado`;
  }

  update(id: number, updateEmpleadoDto: UpdateEmpleadoDto) {
    return `This action updates a #${id} empleado`;
  }

  remove(id: number) {
    return `This action removes a #${id} empleado`;
  }
}