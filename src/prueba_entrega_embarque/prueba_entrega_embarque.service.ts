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

  update(id: number, updatePruebaEntregaEmbarqueDto: UpdatePruebaEntregaEmbarqueDto) {
    return `This action updates a #${id} pruebaEntregaEmbarque`;
  }

  remove(id: number) {
    return `This action removes a #${id} pruebaEntregaEmbarque`;
  }
}
