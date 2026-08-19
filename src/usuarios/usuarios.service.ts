import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Usuario, Estado } from './entities/usuario.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { AppException } from 'src/common/errors/app.exception';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepo: Repository<Usuario>,

    @InjectRepository(Empleado)
    private readonly empleadosRepo: Repository<Empleado>,
  ) {}

  public toResponse(usuario: Usuario) {
    return {
      id: usuario.id,
      rol_id: usuario.rol?.id ?? null,
      rol: usuario.rol
        ? { id: usuario.rol.id, nombre: usuario.rol.nombre }
        : null,
      empleado_id: usuario.empleado?.id ?? null,
      empleado: usuario.empleado
        ? {
            id: usuario.empleado.id,
            no_empleado: usuario.empleado.no_empleado,
            nombre: usuario.empleado.nombre,
            apellido_paterno: usuario.empleado.apellido_paterno,
            apellido_materno: usuario.empleado.apellido_materno,
            fecha_nacimiento: usuario.empleado.fecha_nacimiento,
            fecha_ingreso: usuario.empleado.fecha_ingreso,
            imagen: usuario.empleado.imagen,
            departamento: usuario.empleado.departamento,
            puesto: usuario.empleado.puesto,
            estado: usuario.empleado.estado,
          }
        : null,
      username: usuario.username,
      celular: usuario.celular,
      estado: usuario.estado === Estado.ACTIVO,
    };
  }

  public readonly relacionesUsuario = {
    rol: true,
    empleado: true,
  };

  async createUser(empleadoId: number, username: string, password: string) {
    if (!username) {
      throw new AppException('VAL_REQUIRED_FIELD', { fieldName: 'username' });
    }
    if (!password) {
      throw new AppException('VAL_REQUIRED_FIELD', { fieldName: 'password' });
    }
    if (username.length < 8) {
      throw new AppException('VAL_USERNAME');
    }
    if (password.length < 8) {
      throw new AppException('VAL_PASSWORD_LONG');
    }
    if (!/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).+$/.test(password)) {
      throw new AppException('VAL_PASSWORD_COMPLEXITY');
    }

    const empleado = await this.empleadosRepo.findOneBy({ id: empleadoId });
    if (!empleado) {
      throw new AppException('VAL_RECORD_NOT_FOUND', { record: 'Empleado' });
    }

    const usernameTomado = await this.usuariosRepo.findOne({
      where: { username },
    });
    if (usernameTomado) {
      throw new AppException('VAL_DUPLICATE_FIELD', { fieldName: 'username' });
    }

    const yaExiste = await this.usuariosRepo.findOne({
      where: { empleado: { id: empleadoId } },
    });
    if (yaExiste) {
      throw new AppException('VAL_DUPLICATE_FIELD', {
        fieldName: 'usuario para este empleado',
      });
    }

    const passwordHash = await this.hashPassword(password);

    const usuario = this.usuariosRepo.create({
      username,
      password: passwordHash,
      empleado,
    });
    await this.usuariosRepo.save(usuario);

    // recargo con relaciones para devolver la forma completa
    const creado = await this.usuariosRepo.findOne({
      where: { id: usuario.id },
      relations: this.relacionesUsuario,
    });
    return this.toResponse(creado!);
  }

  async hashPassword(passwordPlano: string): Promise<string> {
    return bcrypt.hash(passwordPlano, 10);
  }

  async findAllUsers() {
    const usuarios = await this.usuariosRepo.find({
      where: { estado: Estado.ACTIVO },
      relations: this.relacionesUsuario,
    });
    return usuarios.map((u) => this.toResponse(u));
  }

  async findOne(id: number) {
    const usuario = await this.usuariosRepo.findOne({
      where: { id },
      relations: this.relacionesUsuario,
    });
    if (!usuario) {
      throw new AppException('VAL_RECORD_NOT_FOUND', { record: 'Usuario' });
    }
    return this.toResponse(usuario);
  }

  // admin actualiza username y/o celular del usuario
  async updateUser(empleadoId: number, username?: string, telefono?: string) {
    const usuario = await this.usuariosRepo.findOne({
      where: { empleado: { id: empleadoId } },
      relations: this.relacionesUsuario,
    });
    if (!usuario) {
      throw new AppException('VAL_RECORD_NOT_FOUND', { record: 'Usuario' });
    }

    if (username !== undefined) {
      if (username.length < 8) throw new AppException('VAL_USERNAME');

      const tomado = await this.usuariosRepo.findOne({
        where: { username, id: Not(usuario.id) },
      });
      if (tomado) {
        throw new AppException('VAL_DUPLICATE_FIELD', { fieldName: 'username' });
      }
      usuario.username = username;
    }

    if (telefono !== undefined) {
      if (!/^\d{1,10}$/.test(telefono)) {
        throw new AppException('VAL_PHONE');
      }

      const telTomado = await this.usuariosRepo.findOne({
        where: { celular: telefono, id: Not(usuario.id) },
      });
      if (telTomado) {
        throw new AppException('VAL_DUPLICATE_FIELD', { fieldName: 'celular' });
      }
      usuario.celular = telefono;
    }

    await this.usuariosRepo.save(usuario);
    return this.toResponse(usuario);
  }

  async removeUser(empleadoId: number) {
    const usuario = await this.usuariosRepo.findOne({
      where: { empleado: { id: empleadoId } },
      relations: this.relacionesUsuario,
    });
    if (!usuario) {
      throw new AppException('VAL_RECORD_NOT_FOUND', { record: 'Usuario' });
    }

    usuario.estado = Estado.INACTIVO;
    await this.usuariosRepo.save(usuario);
    return this.toResponse(usuario);
  }
}