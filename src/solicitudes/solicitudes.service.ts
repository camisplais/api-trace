import { Injectable } from '@nestjs/common';
import { CreateSolicitudeDto } from './dto/create-solicitude.dto';
import { UpdateSolicitudeDto } from './dto/update-solicitude.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Solicitude } from './entities/solicitude.entity';
import { Repository } from 'typeorm';
import { ViajeEmbarque } from 'src/viaje_embarque/entities/viaje_embarque.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { WhatsappService } from 'src/common/whatsapp/whatsapp.service';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { AppException } from 'src/common/errors/app.exception';
import { Estado } from './enums/estado.enum';
import { Tipo } from './enums/tipo.enum';
import { Notificacion } from 'src/notificaciones/entities/notificacione.entity';
import { Estado as EstadoNotificacion } from 'src/notificaciones/enums/estado.enum';
import { QRService } from 'src/codigoQR/qr.service';


const empleado_emisor =  6;
const coordinador_stock = 8;
const empleado_aduanas = 4;

const tipos_cs = [Tipo.SOLICITARQR, Tipo.PE_DESFASADAS, Tipo.ESTATUS_SALIDA];

const tipos_con_whatsapp = [Tipo.SOLICITARQR];


@Injectable()
export class SolicitudesService {
  constructor(
    @InjectRepository(Solicitude) private readonly solicitudRepository: Repository<Solicitude>,
    @InjectRepository(ViajeEmbarque) private readonly viajeEmbarqueRepository: Repository<ViajeEmbarque>,
    @InjectRepository(Empleado) private readonly empleadoRepository: Repository<Empleado>,
    @InjectRepository(Usuario) private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Notificacion) private readonly notificacionRepository: Repository<Notificacion>,
    private readonly whatsappService: WhatsappService,
    private readonly qrService: QRService
  ) {}

  async create(createSolicitudeDto: CreateSolicitudeDto) {
    const viajeEmbarque = await this.viajeEmbarqueRepository.findOne({
      where: { id: createSolicitudeDto.viaje_embarque_id },
    });

    if (!viajeEmbarque) {
      throw new AppException('VAL_RECORD_NOT_FOUND', {record: 'ViajeEmbarque'}
        
      );
    }
    const empleadoReceptorId = this.resolverIdReceptor(createSolicitudeDto, viajeEmbarque);
    const empleadoEmisorId = this.resolverIdEmisor(createSolicitudeDto.tipo);

    const [empleadoReceptor, empleadoEmisor, usuarioReceptor] = await Promise.all([
      this.empleadoRepository.findOneBy({ id: empleadoReceptorId }),
      this.empleadoRepository.findOneBy({ id: empleadoEmisorId }),
      this.usuarioRepository.findOne({
        where: { empleado: { id: empleadoReceptorId } },
      }),
    ]);

    if (!empleadoReceptor) {
      throw new AppException('VAL_RECORD_NOT_FOUND', {record: 'Empleado', id: empleadoReceptorId });
    }
    if (!empleadoEmisor) {
      throw new AppException('VAL_RECORD_NOT_FOUND', {record: 'Empleado', id: empleadoEmisorId });
    }
    

    const solicitud = this.solicitudRepository.create({
      viaje_embarque: viajeEmbarque,
      empleado_emisor: empleadoEmisor,
      empleado_receptor: empleadoReceptor,
      tipo: createSolicitudeDto.tipo,
      estado: Estado.PENDIENTE,
    });

    

    const guardada = await this.solicitudRepository.save(solicitud);

    const solicitudCompleta = await this.solicitudRepository.findOne({
      where: { id: guardada.id },
      relations: {
        empleado_emisor: true,
        empleado_receptor: true,
        viaje_embarque: true,
      },
    });

    if (createSolicitudeDto.tipo === Tipo.PE_PENDIENTES && solicitudCompleta) {
      const notificacion = this.notificacionRepository.create({
        solicitud: solicitudCompleta,
        notificacion: createSolicitudeDto.motivo,
        estado: EstadoNotificacion.NO_LEIDA,
      });
      await this.notificacionRepository.save(notificacion);
    }

    const debeEnviarWhatsapp = tipos_con_whatsapp.includes(createSolicitudeDto.tipo);
    
    if (debeEnviarWhatsapp && usuarioReceptor?.celular) {
      const mensaje = `Tienes una nueva solicitud pendiente de ${empleadoEmisor.nombre} ${empleadoEmisor.apellido_paterno} para el viaje #${viajeEmbarque.viaje.id}.`;
      void this.whatsappService.enviarMensaje(usuarioReceptor.celular, mensaje);
    }

    return solicitudCompleta;
  }
 
    private resolverIdReceptor(dto: CreateSolicitudeDto, viajeEmbarque: ViajeEmbarque): number {
    if (dto.tipo === Tipo.PE_PENDIENTES) {
      return viajeEmbarque.viaje.empleado_embarque.id;
    }

    if (tipos_cs.includes(dto.tipo)) {
      return coordinador_stock;
    }

    if (!dto.empleado_receptor_id) {
      throw new AppException('VAL_REQUIRED_FIELD', { fieldName: 'id_empleado_receptor' });
    }

    return dto.empleado_receptor_id;
  
  }

  private resolverIdEmisor(tipo: Tipo): number {
    if (tipo === Tipo.PE_PENDIENTES) {
      return empleado_aduanas;
    }
    return empleado_emisor;
  }

  async aceptar (id: number) {
    const solicitud = await this.solicitudRepository.findOne({
      where: { id },
      relations: { viaje_embarque: true, empleado_emisor: true, empleado_receptor: true },
    });
    if (!solicitud) {
      throw new AppException('VAL_RECORD_NOT_FOUND', { record: 'Solicitud', id });
    }
    if (solicitud.estado !== Estado.PENDIENTE) {
      throw new AppException('VAL_INVALID_FIELD', { fieldName: 'Solicitud', id, estado: solicitud.estado });
    }

    solicitud.estado = Estado.ACEPTADO;
    const guardada = await this.solicitudRepository.save(solicitud);

    if (solicitud.tipo === Tipo.SOLICITARQR) {
      await this.qrService.generarCodigo(solicitud.viaje_embarque.viaje.id);
    }

    return guardada;
  }

  async rechazar (id: number) {
    const solicitud = await this.solicitudRepository.findOne({
      where: { id },
      relations: { viaje_embarque: true, empleado_emisor: true, empleado_receptor: true },
    });

    if (!solicitud) {
      throw new AppException('VAL_RECORD_NOT_FOUND', { record: 'Solicitud', id });
    }
    if (solicitud.estado !== Estado.PENDIENTE) {
      throw new AppException('VAL_INVALID_FIELD', { fieldName: 'Solicitud', id, estado: solicitud.estado });
    }

    solicitud.estado = Estado.RECHAZADO;
    return this.solicitudRepository.save(solicitud);
  }


  findAll() {
    return `This action returns all solicitudes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} solicitude`;
  }

  update(id: number, updateSolicitudeDto: UpdateSolicitudeDto) {
    return `This action updates a #${id} solicitude`;
  }

  remove(id: number) {
    return `This action removes a #${id} solicitude`;
  }
  }
  



