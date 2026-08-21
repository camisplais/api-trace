import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { Viaje } from 'src/viajes/entities/viaje.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { SeguimientoViaje } from 'src/seguimiento_viaje/entities/seguimiento_viaje.entity';
import { Transporte, Estado } from 'src/transportes/entities/transporte.entity';

@Injectable()
export class QRService {
  constructor(
    @InjectRepository(Viaje)
    private readonly viajeRepo: Repository<Viaje>,

    @InjectRepository(SeguimientoViaje)
    private readonly seguimientoRepo: Repository<SeguimientoViaje>,

    @InjectRepository(Empleado)
    private readonly empleadoRepo: Repository<Empleado>,

    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,

    @InjectRepository(Transporte)
    private readonly transporteRepo: Repository<Transporte>,
  ) {}

  async generarCodigo(viajeId: number) {
    // 1. Validar que el viaje exista
    const viaje = await this.viajeRepo.findOneBy({ id: viajeId });
    if (!viaje) {
      throw new NotFoundException('Viaje no encontrado');
    }

    const codigoQr = uuidv4();

    // 2. Buscar si ya existe seguimiento para este viaje
    const seguimiento = await this.seguimientoRepo.findOne({
      where: { viaje: { id: viajeId } },
    });

    // 3. Ya existe -> solo reemplazar el qr
    if (seguimiento) {
      seguimiento.qr = codigoQr;
      return this.seguimientoRepo.save(seguimiento);
    }

    // 4. No existe -> crear registro nuevo solo con el qr
    const nuevo = this.seguimientoRepo.create({
      viaje,
      qr: codigoQr,
    });
    return this.seguimientoRepo.save(nuevo);
  }

  async getUltimoCodigo(userId: string) {
    // 1. Buscar el usuario (que ya trae el empleado relacionado)
    const usuario = await this.usuarioRepo.findOne({
        where: { id: Number(userId) },
        relations: { empleado: true }
        , // ajusta el nombre si tu relation se llama distinto
    });

    if (!usuario || !usuario.empleado) {
        throw new NotFoundException('No se encontró empleado para este usuario');
    }

    // 2. Buscar el último viaje donde es chofer
    const viaje = await this.viajeRepo.findOne({
        where: { empleado_chofer: { id: usuario.empleado.id } },
        order: { createdAt: 'DESC' },
    });

    if (!viaje) {
        throw new NotFoundException('No se encontró ningún viaje para este chofer');
    }

    // 3. Buscar el seguimiento de ese viaje
    const seguimiento = await this.seguimientoRepo.findOne({
        where: { viaje: { id: viaje.id } },
    });

    if (!seguimiento) {
        throw new NotFoundException('Este viaje no tiene seguimiento/QR generado');
    }

    // 4. Regresar solo el qr
    return { qr: seguimiento.qr };
    }

  async escanearCodigo(qr: string, userId: string) {
    const usuario = await this.usuarioRepo.findOne({
      where: { id: Number(userId) },
      relations: { empleado: true },
    });

    if (!usuario || !usuario.empleado) {
      throw new NotFoundException('No se encontró empleado para este usuario');
    }

    const seguimiento = await this.seguimientoRepo.findOne({
      where: { qr },
    });

    if (!seguimiento) {
      throw new NotFoundException('Código QR no válido o no encontrado');
    }

    if (!seguimiento.salida) {
      seguimiento.salida = new Date();
      seguimiento.empleado_caseta_salida = usuario.empleado;
      await this.seguimientoRepo.save(seguimiento);

      return {
        evento: 'salida',
        hora: seguimiento.salida,
        viajeId: seguimiento.viaje.id,
      };
    }

    if (!seguimiento.entrada) {
      seguimiento.entrada = new Date();
      seguimiento.empleado_caseta_entrada = usuario.empleado;
      await this.seguimientoRepo.save(seguimiento);

      seguimiento.viaje.transporte.estado = Estado.PLANTA;
      await this.transporteRepo.save(seguimiento.viaje.transporte);

      return {
        evento: 'entrada',
        hora: seguimiento.entrada,
        viajeId: seguimiento.viaje.id,
      };
    }

    throw new BadRequestException(
      'Este viaje ya registró entrada y salida. No se puede volver a escanear.',
    );
  }
}