import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { extname } from 'path';
import { PruebaEntregaEmbarque } from './entities/prueba_entrega_embarque.entity';
import { Embarque } from '../embarques/entities/embarque.entity';
import { DocCliente } from '../doc_cliente/entities/doc_cliente.entity';
import { CreatePruebaEntregaEmbarqueDto } from './dto/create-prueba_entrega_embarque.dto';
import { UpdatePruebaEntregaEmbarqueDto } from './dto/update-prueba_entrega_embarque.dto';
import { AppException } from 'src/common/errors/app.exception';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ViajeEmbarque } from 'src/viaje_embarque/entities/viaje_embarque.entity';
import { Solicitude } from 'src/solicitudes/entities/solicitude.entity';
import { Tipo } from 'src/solicitudes/enums/tipo.enum';
import { Estado } from 'src/solicitudes/enums/estado.enum';
import { FiltroPruebasDto } from './dto/filtro-prueba.dto';

@Injectable()
export class PruebaEntregaEmbarqueService {
  private readonly s3: S3Client;
  private readonly bucket: string;


  constructor(
    @InjectRepository(PruebaEntregaEmbarque)
    private readonly pruebaRepo: Repository<PruebaEntregaEmbarque>,
    @InjectRepository(Embarque)
    private readonly embarqueRepo: Repository<Embarque>,
    @InjectRepository(DocCliente)
    private readonly docClienteRepo: Repository<DocCliente>,
    @InjectRepository(ViajeEmbarque)
    private readonly viajeEmbarqueRepo: Repository<ViajeEmbarque>,
    @InjectRepository(Solicitude)
    private readonly solicitudeRepo: Repository<Solicitude>,
    private readonly configService: ConfigService,
  ) {
    this.s3 = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        )!,
      },
    });
    this.bucket = this.configService.get<string>('AWS_S3_BUCKET')!;
  }

  async create(
    embarqueId: number,
    docClienteId: number,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new AppException('FILE_REQUIRED');
    }

    const embarque = await this.embarqueRepo.findOne({
      where: { id: embarqueId },
    });
    if (!embarque) {
      throw new AppException('VAL_RECORD_NOT_FOUND', { record: 'Embarque' });
    }

    const docCliente = await this.docClienteRepo.findOne({
      where: {
        id: docClienteId,
        cliente: { id: embarque.cliente.id },
      },
    });
    if (!docCliente) {
      throw new AppException('VAL_RECORD_NOT_FOUND', { record: 'docCliente_id' });
    }

    const fecha = new Date();
    const anio = fecha.getFullYear();
    const clienteSlug = embarque.cliente.nombre.replace(/\s+/g, '');
    const nombreArchivo = this.generarNombreArchivo(
      embarque.cliente.nombre,
      docCliente.documento.nombre,
      fecha,
    );
    const extension = extname(file.originalname);
    const key = `pruebas-entrega/${clienteSlug}/${anio}/${nombreArchivo}${extension}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const prueba = this.pruebaRepo.create({
      embarque: { id: embarqueId },
      docCliente: { id: docClienteId },
      ruta_imagen: key,
    });

    return this.pruebaRepo.save(prueba);
  }

  private generarNombreArchivo(
    clienteNombre: string,
    documentoNombre: string,
    fecha: Date,
  ): string {
    const clienteSlug = clienteNombre.replace(/\s+/g, '');
    const documentoSlug = documentoNombre.replace(/\s+/g, '');
    const yy = String(fecha.getFullYear()).slice(-2);
    const mm = String(fecha.getMonth() + 1).padStart(2, '0');
    const dd = String(fecha.getDate()).padStart(2, '0');
    const timestampCorto = Date.now().toString(36); // base36, corto y único

    return `${clienteSlug}${documentoSlug}${yy}${mm}${dd}${timestampCorto}`;
  }

  async subirPruebaDesfasada(
    viajeEmbarqueId: number,
    embarqueId: number,
    docClienteId: number,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new AppException('FILE_REQUIRED');
    }

    const viajeEmbarque = await this.viajeEmbarqueRepo.findOne({
      where: { viaje: { id: viajeEmbarqueId }, embarque: { id: embarqueId } },
    });

    if (!viajeEmbarque) {
      throw new AppException('VAL_RECORD_NOT_FOUND', { record: 'ViajeEmbarque' });
    }

    const solicitudAceptada = await this.solicitudeRepo.findOne({
      where: {
        viaje_embarque: { id: viajeEmbarque.id },
        tipo: Tipo.PE_DESFASADAS,
        estado: Estado.ACEPTADO,
      },
    });

    if (!solicitudAceptada) {
      throw new AppException('VAL_RECORD_NOT_FOUND', { record: 'Solicitud Aceptada' });
    }

    const embarque = viajeEmbarque.embarque;
    const docCliente = await this.docClienteRepo.findOne({
      where: {
        id: docClienteId,
        cliente: { id: embarque.cliente.id },
      },
    });

    if (!docCliente) {
      throw new AppException('VAL_RECORD_NOT_FOUND', { record: 'docCliente_id' });
    }

    const pruebaExistente = await this.pruebaRepo.findOne({
      where: {
        embarque: { id: embarqueId },
        docCliente: { id: docClienteId },
      },
    });

    if (pruebaExistente) {
      throw new AppException('VAL_RECORD_ALREADY_EXISTS', { record: 'PruebaEntregaEmbarque' });
    }

    const fecha = new Date();
    const anio = fecha.getFullYear();
    const clienteSlug = embarque.cliente.nombre.replace(/\s+/g, '');
    const nombreArchivo = this.generarNombreArchivo(
      embarque.cliente.nombre,
      docCliente.documento.nombre,
      fecha,
    );
    const extension = extname(file.originalname);
    const key = `pruebas-entrega/${clienteSlug}/${anio}/${nombreArchivo}${extension}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const prueba = this.pruebaRepo.create({
      embarque: { id: embarqueId },
      docCliente: { id: docClienteId },
      ruta_imagen: key,
    });
    
    return this.pruebaRepo.save(prueba);
  }

  async findAll() {
    return this.pruebaRepo.find();
  }

  async findOne(id: number) {
     const prueba = await this.pruebaRepo.findOne({ where: { id } });
    if (!prueba) {
      throw new AppException('VAL_RECORD_NOT_FOUND', {
        record: 'Prueba de entrega',
      });
    }
    return prueba;
  }

  async findByEmbarque(embarqueId: number) {
    const pruebas = await this.pruebaRepo.find({
      where: { embarque: { id: embarqueId } },
      relations: { docCliente: { documento: true } }, // Asegúrate de cargar las relaciones si no están en eager
      order: { createdAt: 'DESC' },
    });

    if (!pruebas || pruebas.length === 0) {
      return {
        data: [],
        msg: {
          msg: 'sin documentos',
        },
      };
    }

    const data = await Promise.all(
      pruebas.map(async (p) => ({
        id: p.id,
        documento_nombre: p.docCliente?.documento?.nombre,
        url: await getSignedUrl(
          this.s3,
          new GetObjectCommand({ Bucket: this.bucket, Key: p.ruta_imagen }),
          { expiresIn: 3600 },
        ),
        createdAt: p.createdAt,
      })),
    );

    return {
      data,
      msg: {
        msg: 'Documentos encontrados',
      },
    };
  }

  async findEmbarquesPendientesPorViaje(viajeId: number) {
    const viajeEmbarques = await this.viajeEmbarqueRepo.find({
      where: { viaje: { id: viajeId } },
      relations: { embarque: true },
    });
    if (viajeEmbarques.length === 0) {
      return [];
    }

    const resultado = await Promise.all(
      viajeEmbarques.map(async (ve) => {
        const embarque = ve.embarque;

        const totalRequeridos = await this.docClienteRepo.count({
          where: { cliente: { id: embarque.cliente.id } },
        });

        const totalSubidos = await this.pruebaRepo.count({
          where: { embarque: { id: embarque.id } },
        });

        return {
          viaje_embarque_id: ve.id,
          embarque,
          total_requeridos: totalRequeridos,
          total_subidos: totalSubidos,
          pendientes: totalSubidos < totalRequeridos,
        };
      }),
    );

    return resultado.filter((item) => item.pendientes);
  }

  async findEmbarquesPendientesGlobal() {
    const embarques = await this.embarqueRepo.find({
      relations: { cliente: true },
    });

    if (embarques.length === 0) {
      return [];
    }

    const resultado = await Promise.all(
      embarques.map(async (embarque) => {
        const totalRequeridos = await this.docClienteRepo.count({
          where: { cliente: { id: embarque.cliente.id } },
        });
        const totalSubidos = await this.pruebaRepo.count({
          where: { embarque: { id: embarque.id } },
        });

        const viajeEmbarque = await this.viajeEmbarqueRepo.findOne({
        where: { embarque: { id: embarque.id } },
        relations: { viaje: true },
      });

        return {
          viaje_embarque_id: viajeEmbarque?.id ?? null,
          viaje_id: viajeEmbarque?.viaje?.id ?? null,
          embarque,
          total_requeridos: totalRequeridos,
          total_subidos: totalSubidos,
          pendientes: totalSubidos < totalRequeridos,
        };
      }),
    );

    return resultado.filter((item) => item.pendientes);
  }

  async findDocsFaltantesPorEmbarque(embarqueId: number) {
    const embarque = await this.embarqueRepo.findOne({
      where: { id: embarqueId },
      relations: { cliente: true },
    });
    if (!embarque) {
      throw new AppException('VAL_RECORD_NOT_FOUND', { record: 'Embarque' });
    }

    const docsRequeridos = await this.docClienteRepo.find({
      where: { cliente: { id: embarque.cliente.id } },
      relations: { documento: true },
    });

    const docsSubidos = await this.pruebaRepo.find({
      where: { embarque: { id: embarqueId } },
      relations: { docCliente: { documento: true } },
    });

    const idsSubidos = new Set(docsSubidos.map((doc) => doc.docCliente.id));

    const docsFaltantes = docsRequeridos.filter((doc) => !idsSubidos.has(doc.id)).map((doc) => ({
      doc_cliente_id: doc.id,
      documento_nombre: doc.documento.nombre,
    }));

    return {
      embarque_id: embarque.id,
      cliente_nombre: embarque.cliente.nombre,
      total_requeridos: docsRequeridos.length,
      total_subidos: docsSubidos.length,
      docsFaltantes,
    };
  }

  // buscador de archivos aduanas

  /** Las pruebas de entrega del cliente, filtradas y paginadas en SQL. */
  async listarDocumentos(f: FiltroPruebasDto) {
    const page = f.page ?? 1;
    const limit = f.limit ?? 10;

    const qb = this.pruebaRepo
      .createQueryBuilder('prueba')
      .innerJoinAndSelect('prueba.embarque', 'embarque')
      .innerJoinAndSelect('prueba.docCliente', 'docCliente')
      .innerJoinAndSelect('docCliente.documento', 'documento')
      .where('embarque.cliente_id = :clienteId', { clienteId: f.cliente_id })
      .andWhere('prueba.deletedAt IS NULL');

    if (f.anio) {
      qb.andWhere('YEAR(prueba.createdAt) = :anio', { anio: f.anio });
    }
    if (f.mes) {
      qb.andWhere('MONTH(prueba.createdAt) = :mes', { mes: f.mes });
    }
    if (f.tipo) {
      qb.andWhere('embarque.tipo = :tipo', { tipo: f.tipo });
    }
    if (f.search) {
      const texto = f.search.replace(/[\\%_]/g, (c) => `\\${c}`);
      qb.andWhere('documento.nombre LIKE :search', { search: `%${texto}%` });
    }
    if (f.fecha_inicio) {
      qb.andWhere('prueba.createdAt >= :desde', { desde: `${f.fecha_inicio} 00:00:00` });
    }
    if (f.fecha_fin) {
      qb.andWhere('prueba.createdAt <= :hasta', { hasta: `${f.fecha_fin} 23:59:59` });
    }

    const [items, total] = await qb
      .orderBy('prueba.createdAt', 'DESC')
      .addOrderBy('prueba.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: items.map((p) => ({
        id: p.id,
        documento_nombre: p.docCliente.documento.nombre,
        plan_embarque: p.embarque.plan_embarque,
        tipo: p.embarque.tipo,
        createdAt: p.createdAt,
      })),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async obtenerUrlDescarga(id: number) {
    const prueba = await this.pruebaRepo.findOneOrFail({ where: { id } });

    return {
      url: await getSignedUrl(
        this.s3,
        new GetObjectCommand({ Bucket: this.bucket, Key: prueba.ruta_imagen }),
        { expiresIn: 300 },
      ),
    };
  }

  update(id: number, updatePruebaEntregaEmbarqueDto: UpdatePruebaEntregaEmbarqueDto) {
    return `This action updates a #${id} pruebaEntregaEmbarque`;
  }

  remove(id: number) {
    return `This action removes a #${id} pruebaEntregaEmbarque`;
  }
}
