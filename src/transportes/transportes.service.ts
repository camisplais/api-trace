import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { extname } from 'path';
import { Transporte, Estado } from './entities/transporte.entity';
import { CreateTransporteDto } from './dto/create-transporte.dto';
import { UpdateTransporteDto } from './dto/update-transporte.dto';
import { FindTransportesDto } from './dto/find-transportes.dto';
import { AppException } from 'src/common/errors/app.exception';

@Injectable()
export class TransportesService {
  private readonly s3: S3Client;
  private readonly bucket: string;

  constructor(
    @InjectRepository(Transporte)
    private readonly transporteRepo: Repository<Transporte>,
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
    createTransporteDto: CreateTransporteDto,
    imagen?: Express.Multer.File,
  ) {
    const existente = await this.transporteRepo.findOne({
      where: { placas: createTransporteDto.placas },
    });
    if (existente) {
      throw new AppException('VAL_DUPLICATE_FIELD', { fieldName: 'placas' });
    }

    let rutaImagen: string | undefined;
    if (imagen) {
      rutaImagen = await this.subirImagen(imagen, createTransporteDto.placas);
    }

    const transporte = this.transporteRepo.create({
      marca: createTransporteDto.marca,
      placas: createTransporteDto.placas,
      carga_util: createTransporteDto.carga_util,
      imagen: rutaImagen,
      // Una unidad recien registrada arranca disponible en planta
      estado: Estado.PLANTA,
    });

    const guardado = await this.transporteRepo.save(transporte);
    return this.formatear(guardado);
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

  async findOne(id: number) {
    const transporte = await this.transporteRepo.findOne({ where: { id } });
    if (!transporte) {
      throw new AppException('VAL_RECORD_NOT_FOUND', { record: 'Transporte' });
    }
    return this.formatear(transporte);
  }

  async update(
    id: number,
    updateTransporteDto: UpdateTransporteDto,
    imagen?: Express.Multer.File,
  ) {
    const transporte = await this.transporteRepo.findOne({ where: { id } });
    if (!transporte) {
      throw new AppException('VAL_RECORD_NOT_FOUND', { record: 'Transporte' });
    }

    if (
      updateTransporteDto.placas &&
      updateTransporteDto.placas !== transporte.placas
    ) {
      const existente = await this.transporteRepo.findOne({
        where: { placas: updateTransporteDto.placas },
      });
      if (existente) {
        throw new AppException('VAL_DUPLICATE_FIELD', { fieldName: 'placas' });
      }
      transporte.placas = updateTransporteDto.placas;
    }

    if (imagen) {
      transporte.imagen = await this.subirImagen(imagen, transporte.placas);
    }

    const guardado = await this.transporteRepo.save(transporte);
    return this.formatear(guardado);
  }

  async remove(id: number) {
    const transporte = await this.transporteRepo.findOne({ where: { id } });
    if (!transporte) {
      throw new AppException('VAL_RECORD_NOT_FOUND', { record: 'Transporte' });
    }
    await this.transporteRepo.softDelete(id);
  }

  private async subirImagen(
    file: Express.Multer.File,
    placas: string,
  ): Promise<string> {
    const anio = new Date().getFullYear();
    const placasSlug = placas.replace(/\s+/g, '');
    const timestampCorto = Date.now().toString(36);
    const extension = extname(file.originalname);
    const key = `transportes/${anio}/${placasSlug}-${timestampCorto}${extension}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return key;
  }

  private formatear(transporte: Transporte) {
    return {
      id: transporte.id,
      marca: transporte.marca,
      placas: transporte.placas,
      carga_util: transporte.carga_util,
      imagen: transporte.imagen ?? null,
      estado: transporte.estado,
    };
  }
}