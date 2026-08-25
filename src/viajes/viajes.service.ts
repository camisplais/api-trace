import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Viaje } from './entities/viaje.entity';
import { ViajeEmbarque } from 'src/viaje_embarque/entities/viaje_embarque.entity';
import { CrearViajeDto } from './dto/create-viaje.dto';
import { AgregarEmbarqueDto } from './dto/agregar-embarque.dto';
import { UpdateViajeDto } from './dto/update-viaje.dto';
import { Transporte } from 'src/transportes/entities/transporte.entity';
import { Estado as EstadoTransporte} from 'src/transportes/entities/transporte.entity';
import { Estado as EstadoEmpleado} from 'src/empleados/entities/empleado.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { AppException } from 'src/common/errors/app.exception';
import { Embarque } from 'src/embarques/entities/embarque.entity';
import { FindViajesDto } from './dto/find-viajes.dto';
import { SeguimientoViaje } from 'src/seguimiento_viaje/entities/seguimiento_viaje.entity';

@Injectable()
export class ViajesService {
  private readonly EMPLEADO_POR_ASIGNAR_ID=16

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(Viaje)
    private readonly viajeRepo: Repository<Viaje>,
    @InjectRepository(Transporte)
    private readonly transporteRepo: Repository<Transporte>,
    @InjectRepository(Empleado)
    private readonly empleadoRepo: Repository<Empleado>,
    @InjectRepository(Embarque)
    private readonly embarqueRepo: Repository<Embarque>,
    @InjectRepository(ViajeEmbarque)
    private readonly viajeEmbarqueRepo: Repository<ViajeEmbarque>,
    @InjectRepository(SeguimientoViaje)
    private readonly seguimientoRepo: Repository<SeguimientoViaje>,

  ) {}
  
    async crearViaje(dto: CrearViajeDto, userId:number | string)
    {
      const empleadoEmbarqueId = Number(userId);
      // 1. Validar transporte existe y está disponible
      const transporte = await this.transporteRepo.findOne({
        where: { id: dto.transporte_id },
      });
      if (!transporte) {
        throw new AppException('VAL_RECORD_NOT_FOUND', { record: 'Transporte' });
      }
      if (transporte.estado !== EstadoTransporte.PLANTA) {
        throw new AppException('TRANS_NOT_AVAILABLE');
      }

      // 2. Validar chofer existe y está disponible
      const chofer = await this.empleadoRepo.findOne({
        where: { id: dto.empleado_chofer_id },
      });
      if (!chofer) {
        throw new AppException('VAL_RECORD_NOT_FOUND', { record: 'Chofer' });
      }
      if (chofer.estado !== EstadoEmpleado.DISPONIBLE) {
        throw new AppException('EMP_NOT_AVAILABLE');
      }

      // 3. Validar embarque existe
      const embarque = await this.embarqueRepo.findOne({
        where: { id: dto.embarque_id },
      });
      if (!embarque) {
        throw new AppException('VAL_RECORD_NOT_FOUND', { record: 'Embarque' });
      }

      // 4. Validar que el embarque no esté ya asignado a otro viaje
      const yaAsignado = await this.viajeEmbarqueRepo.findOne({
        where: { embarque: { id: dto.embarque_id } },
      });
      if (yaAsignado) {
        throw new AppException('EMB_ALREADY_ASSIGNED');
      }

      return this.dataSource.transaction(async (manager) => {
        const viaje = manager.create(Viaje, {
          empleado_chofer: { id: dto.empleado_chofer_id },
          empleado_embarque: { id: empleadoEmbarqueId },
          transporte: { id: dto.transporte_id },
        });
        const viajeGuardado = await manager.save(viaje);

        const viajeEmbarque = manager.create(ViajeEmbarque, {
          viaje: { id: viajeGuardado.id },
          embarque: { id: dto.embarque_id },
        });
        await manager.save(viajeEmbarque);

        // 5. Crear el registro inicial de seguimiento
        const seguimiento = manager.create(SeguimientoViaje, {
          viaje: { id: viajeGuardado.id },
          entrada: undefined,
          salida: undefined,
          empleado_caseta_entrada: { id: this.EMPLEADO_POR_ASIGNAR_ID },
          empleado_caseta_salida: { id: this.EMPLEADO_POR_ASIGNAR_ID },
          empleado_qr_salida: { id: this.EMPLEADO_POR_ASIGNAR_ID },
          qr: 'PENDIENTE',
        });
        await manager.save(seguimiento);

        await manager.update(Transporte, transporte.id, {
          estado: EstadoTransporte.VIAJE,
        });
        await manager.update(Empleado, chofer.id, {
          estado: EstadoEmpleado.OCUPADO,
        });

        return manager.findOne(Viaje, {
          where: { id: viajeGuardado.id },
          relations: { viajeEmbarques: true },
        });
      });
    }

  

  async agregarEmbarque(viajeId: number, dto: AgregarEmbarqueDto) {
    const viaje = await this.viajeRepo.findOne({ where: { id: viajeId } });
    if (!viaje) {
      throw new NotFoundException(`Viaje ${viajeId} no encontrado`);
    }

    return this.dataSource.transaction(async (manager) => {
      const viajeEmbarque = manager.create(ViajeEmbarque, {
        viaje: { id: viajeId },
        embarque: { id: dto.embarque_id },
      });
      return manager.save(viajeEmbarque);
    });
  }

  async findAll(query: FindViajesDto) {
    const page = Number(query.page) || 1;
    const perPage = Number(query.per_page) || 5;

    const ahora = new Date();
    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');
    const hoyStr = `${anio}-${mes}-${dia}`;

    const fechaDesde = query.fecha_desde || hoyStr;
    const fechaHasta = query.fecha_hasta || hoyStr;

    const idQb = this.viajeRepo
      .createQueryBuilder('viaje')
      .leftJoin('viaje.empleado_chofer', 'empleado_chofer')
      .leftJoin('viaje.transporte', 'transporte');

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
    idQb.andWhere('DATE(viaje.createdAt) >= :fechaDesde', { fechaDesde });
    idQb.andWhere('DATE(viaje.createdAt) <= :fechaHasta', { fechaHasta });

    // Una sola llamada: cuenta y pagina al mismo tiempo, igual que en Embarques
    const [viajesBase, total] = await idQb
      .orderBy('viaje.id', 'DESC')
      .skip((page - 1) * perPage)
      .take(perPage)
      .getManyAndCount();

    const ids = viajesBase.map((v) => v.id);

    const viajes = ids.length
      ? await this.viajeRepo
          .createQueryBuilder('viaje')
          .leftJoinAndSelect('viaje.empleado_chofer', 'empleado_chofer')
          .leftJoinAndSelect('viaje.empleado_embarque', 'empleado_embarque')
          .leftJoinAndSelect('viaje.transporte', 'transporte')
          .leftJoinAndSelect('viaje.seguimiento', 'seguimiento')
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
      createdAt: viaje.createdAt,
      empleado_chofer_id: viaje.empleado_chofer?.id,
      empleado_chofer: viaje.empleado_chofer,
      empleado_embarques_id: viaje.empleado_embarque?.id,
      empleado_embarques: viaje.empleado_embarque,
      transporte_id: viaje.transporte?.id,
      transporte: viaje.transporte,
      seguimiento: viaje.seguimiento
        ? {
            entrada: viaje.seguimiento.entrada,
            salida: viaje.seguimiento.salida,
          }
        : null,
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
