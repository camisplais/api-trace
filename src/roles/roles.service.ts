import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AppException } from 'src/common/errors/app.exception';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepo: Repository<Role>,
  ) {}

  /** Solo id y nombre: es lo unico que ocupa el select de "Rol / Permiso". */
  async findAll() {
    const roles = await this.rolesRepo.find({ order: { nombre: 'ASC' } });
    return roles.map((rol) => ({ id: rol.id, nombre: rol.nombre }));
  }

  async findOne(id: number) {
    const rol = await this.rolesRepo.findOneBy({ id });
    if (!rol) {
      throw new AppException('VAL_RECORD_NOT_FOUND', { record: 'Rol' });
    }
    return { id: rol.id, nombre: rol.nombre };
  }

  // Los roles son un catalogo fijo que se siembra con `seed-roles`, no se
  // administran desde la app. Se dejan sin implementar a proposito.
  create(createRoleDto: CreateRoleDto) {
    throw new AppException('VAL_INVALID_FIELD', { fieldName: 'rol' });
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    throw new AppException('VAL_INVALID_FIELD', { fieldName: 'rol' });
  }

  remove(id: number) {
    throw new AppException('VAL_INVALID_FIELD', { fieldName: 'rol' });
  }
}
