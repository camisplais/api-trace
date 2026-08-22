import { Injectable, BadRequestException } from '@nestjs/common';
import { parse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';
import { InjectRepository } from '@nestjs/typeorm';
import {In, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { extname } from 'path';
import { Empleado,Departamento, Estado } from './entities/empleado.entity';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { FindEmpleadosDto } from './dto/find-empleados.dto';
import { AppException } from 'src/common/errors/app.exception';

interface FilaEmpleado {
  no_empleado: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno?: string;
  fecha_nacimiento: string;
  fecha_ingreso: string;
  departamento: string;
  puesto: string;
  estado?: string;
}

const EXPECTED_COLUMNS = [
  'no_empleado',
  'nombre',
  'apellido_paterno',
  'apellido_materno',
  'fecha_nacimiento',
  'fecha_ingreso',
  'departamento',
  'puesto',
  'estado',
];

const EXTENSIONES_PERMITIDAS = ['.csv', '.xlsx', '.xls'];

@Injectable()
export class EmpleadosService {
  /**
   * Empleado comodin que siembra `seed-empleados` ("POR ASIGNAR"). Existe
   * porque otras tablas lo necesitan como referencia, pero nunca se lista.
   */
  static readonly NO_EMPLEADO_COMODIN = 1;

  private readonly s3: S3Client;
  private readonly bucket: string;

  constructor(
    @InjectRepository(Empleado)
    private readonly empleadoRepo: Repository<Empleado>,
    private readonly configService: ConfigService,
  ) {
    // Mismo storage (S3) que usa el modulo de transportes.
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

  async importarArchivo(file: Express.Multer.File) {
    if (!file) {
      throw new AppException('FILE_REQUIRED');
    }

    const nombreArchivo = file.originalname.toLowerCase();
    const extension = EXTENSIONES_PERMITIDAS.find((ext) =>
      nombreArchivo.endsWith(ext),
    );
    if (!extension) {
      throw new AppException('FILE_INVALID_TYPE');
    }

    let rows: FilaEmpleado[];
    try {
      rows =
        extension === '.csv'
          ? this.parsearCsv(file.buffer)
          : this.parsearExcel(file.buffer);
    } catch {
      throw new AppException('FILE_INVALID_CONTENT');
    }

    if (rows.length === 0) {
      throw new AppException('FILE_INVALID_CONTENT');
    }

    const columns = Object.keys(rows[0]);
    const requeridas = EXPECTED_COLUMNS.filter(
      (c) => c !== 'estado' && c !== 'apellido_materno',
    );
    const missingColumns = requeridas.filter((c) => !columns.includes(c));
    const extraColumns = columns.filter((c) => !EXPECTED_COLUMNS.includes(c));

    if (missingColumns.length > 0 || extraColumns.length > 0) {
      throw new AppException('FILE_INVALID_CONTENT');
    }

    // 1. Validar TODAS las filas primero (sin tocar la BD)
    const filasConErrores: { fila: number; errores: string[] }[] = [];
    const empleadosValidos: Partial<Empleado>[] = [];

    rows.forEach((row, index) => {
      const { datos, errores } = this.validarFila(row);
      if (errores.length > 0) {
        filasConErrores.push({ fila: index + 2, errores });
      } else {
        empleadosValidos.push(datos!);
      }
    });

    // 2. Si hay CUALQUIER fila inválida, se rechaza el archivo completo
    //    (con detalle fila por fila para el front)
    if (filasConErrores.length > 0) {
      throw new BadRequestException({
        code: 'FILE_003',
        message: 'El contenido del archivo no coincide con la estructura requerida',
        detalles: filasConErrores,
      });
    }

    // 3. Validar duplicados dentro del mismo archivo
    const numeros = empleadosValidos.map((e) => e.no_empleado!);
    const duplicadosEnArchivo = numeros.filter(
      (n, i) => numeros.indexOf(n) !== i,
    );
    if (duplicadosEnArchivo.length > 0) {
      throw new AppException('VAL_DUPLICATE_FIELD', {
        fieldName: 'no_empleado',
      });
    }

    // 4. Validar duplicados contra la BD
    const existentes = await this.empleadoRepo.findBy({
      no_empleado: In(numeros),
    });
    if (existentes.length > 0) {
      throw new AppException('VAL_DUPLICATE_FIELD', {
        fieldName: 'no_empleado',
      });
    }

    // 5. Insertar todo de una vez
    const entidades = this.empleadoRepo.create(empleadosValidos);
    const guardados = await this.empleadoRepo.save(entidades);

    return {
      data: guardados,
      msg: `${guardados.length} empleados importados correctamente`,
    };
  }

  private parsearCsv(buffer: Buffer): FilaEmpleado[] {
    const csvContent = buffer.toString('utf-8');
    return parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as FilaEmpleado[];
  }

  private parsearExcel(buffer: Buffer): FilaEmpleado[] {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const primeraHoja = workbook.SheetNames[0];
    const hoja = workbook.Sheets[primeraHoja];
    return XLSX.utils.sheet_to_json<FilaEmpleado>(hoja, {
      raw: false,
      defval: '',
    });
  }

  private validarFila(row: FilaEmpleado): {
    datos: Partial<Empleado> | null;
    errores: string[];
  } {
    const errores: string[] = [];

    const noEmpleado = Number(row.no_empleado);
    if (!row.no_empleado || Number.isNaN(noEmpleado) || noEmpleado < 0) {
      errores.push('no_empleado debe ser un número válido');
    }

    if (!row.nombre) errores.push('nombre es obligatorio');
    if (!row.apellido_paterno) errores.push('apellido_paterno es obligatorio');

    if (!row.fecha_nacimiento) {
      errores.push('fecha_nacimiento es obligatoria');
    } else if (Number.isNaN(Date.parse(row.fecha_nacimiento))) {
      errores.push(`fecha_nacimiento inválida: "${row.fecha_nacimiento}"`);
    }

    if (!row.fecha_ingreso) {
      errores.push('fecha_ingreso es obligatoria');
    } else if (Number.isNaN(Date.parse(row.fecha_ingreso))) {
      errores.push(`fecha_ingreso inválida: "${row.fecha_ingreso}"`);
    }

    const departamento = this.parseDepartamento(row.departamento);
    if (!row.departamento) {
      errores.push('departamento es obligatorio');
    } else if (departamento === null) {
      errores.push(`departamento inválido: "${row.departamento}"`);
    }

    if (!row.puesto) errores.push('puesto es obligatorio');

    let estado: Estado | null = null;
    if (row.estado) {
      estado = this.parseEstado(row.estado);
      if (estado === null) {
        errores.push(`estado inválido: "${row.estado}"`);
      }
    }

    const datos: Partial<Empleado> | null =
      errores.length === 0
        ? {
            no_empleado: noEmpleado,
            nombre: row.nombre,
            apellido_paterno: row.apellido_paterno,
            apellido_materno: row.apellido_materno || undefined,
            fecha_nacimiento: new Date(row.fecha_nacimiento),
            fecha_ingreso: new Date(row.fecha_ingreso),
            departamento: departamento!,
            puesto: row.puesto,
            estado: estado ?? undefined,
          }
        : null;

    return { datos, errores };
  }

  private parseDepartamento(value: string): Departamento | null {
    const normalizado = value?.trim().toUpperCase();
    const match = Object.values(Departamento).find(
      (d) => d.toUpperCase() === normalizado,
    );
    return (match as Departamento) ?? null;
  }

  private parseEstado(value: string): Estado | null {
    if (!value) return null;
    const normalizado = value.trim().toUpperCase();
    const match = Object.values(Estado).find(
      (e) => e.toUpperCase() === normalizado,
    );
    return (match as Estado) ?? null;
  }

  create(createEmpleadoDto: CreateEmpleadoDto) {
    return 'This action adds a new empleado';
  }

  async findAll(query: FindEmpleadosDto) {
    const page = Number(query.page) || 1;
    const perPage = Number(query.per_page) || 20;

    const qb = this.empleadoRepo
      .createQueryBuilder('empleado')
      // Traemos la cuenta (usuario) para la columna "CUENTA" del listado.
      .leftJoinAndSelect('empleado.usuario', 'usuario')
      // El seeder crea un empleado comodin "POR ASIGNAR" con no_empleado = 1
      // que la BD necesita pero que no debe verse en el front. Se filtra aqui
      // y no en el cliente para que el total y la paginacion no lo cuenten.
      .where('empleado.no_empleado != :comodin', {
        comodin: EmpleadosService.NO_EMPLEADO_COMODIN,
      });

    if (query.departamento) {
      qb.andWhere('empleado.departamento = :departamento', {
        departamento: query.departamento,
      });
    }

    if (query.estado) {
      qb.andWhere('empleado.estado = :estado', { estado: query.estado });
    }

    // Busqueda libre por no. de empleado, nombre o apellidos.
    if (query.search && query.search.trim()) {
      const termino = `%${query.search.trim()}%`;
      qb.andWhere(
        `(CAST(empleado.no_empleado AS CHAR) LIKE :termino
          OR empleado.nombre LIKE :termino
          OR empleado.apellido_paterno LIKE :termino
          OR empleado.apellido_materno LIKE :termino)`,
        { termino },
      );
    }

    qb.orderBy('empleado.id', 'DESC')
      .skip((page - 1) * perPage)
      .take(perPage);

    const [empleados, total] = await qb.getManyAndCount();

    const data = await Promise.all(empleados.map((e) => this.formatear(e)));

    return {
      data,
      meta: {
        total,
        page,
        per_page: perPage,
        last_page: Math.ceil(total / perPage) || 1,
      },
    };
  }

  /**
   * Actualiza (o registra) la foto del empleado.
   * Sube la imagen a S3 y guarda la clave en `empleado.imagen`.
   */
  async actualizarFoto(id: number, file?: Express.Multer.File) {
    if (!file) {
      throw new AppException('FILE_REQUIRED');
    }

    const empleado = await this.empleadoRepo.findOne({
      where: { id },
      relations: { usuario: true },
    });
    if (!empleado) {
      throw new AppException('VAL_RECORD_NOT_FOUND', { record: 'Empleado' });
    }

    empleado.imagen = await this.subirImagen(file, empleado.no_empleado);
    const guardado = await this.empleadoRepo.save(empleado);

    return {
      data: await this.formatear(guardado),
      msg: 'Foto actualizada correctamente',
    };
  }

  /** Sube la imagen a S3 y devuelve la clave del objeto. */
  private async subirImagen(
    file: Express.Multer.File,
    noEmpleado: number,
  ): Promise<string> {
    const anio = new Date().getFullYear();
    const timestampCorto = Date.now().toString(36);
    const extension = extname(file.originalname);
    const key = `empleados/${anio}/${noEmpleado}-${timestampCorto}${extension}`;

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

  /**
   * Convierte la clave de S3 en una URL prefirmada (temporal) para mostrar
   * la imagen sin abrir el bucket al publico.
   */
  private async urlImagen(key?: string | null): Promise<string | null> {
    if (!key) return null;
    return getSignedUrl(
      this.s3,
      new GetObjectCommand({ Bucket: this.bucket, Key: key }),
      { expiresIn: 3600 }, // 1 hora
    );
  }

  /** Forma en la que el listado/detalle exponen un empleado al frontend. */
  private async formatear(empleado: Empleado) {
    return {
      id: empleado.id,
      no_empleado: empleado.no_empleado,
      nombre: empleado.nombre,
      apellido_paterno: empleado.apellido_paterno,
      apellido_materno: empleado.apellido_materno ?? null,
      fecha_nacimiento: empleado.fecha_nacimiento,
      fecha_ingreso: empleado.fecha_ingreso,
      departamento: empleado.departamento,
      puesto: empleado.puesto,
      estado: empleado.estado ?? null,
      imagen: await this.urlImagen(empleado.imagen),
      // La creacion de cuenta esta pendiente; aqui solo exponemos si ya existe.
      cuenta: empleado.usuario
        ? { id: empleado.usuario.id, username: empleado.usuario.username }
        : null,
    };
  }

  async findChoferes(soloDisponibles = false) {
    const qb = this.empleadoRepo
      .createQueryBuilder('empleado')
      .where('LOWER(empleado.puesto) LIKE :puesto', { puesto: '%chofer%' })
      .andWhere('empleado.no_empleado != :comodin', {
        comodin: EmpleadosService.NO_EMPLEADO_COMODIN,
      });

    if (soloDisponibles) {
      qb.andWhere('empleado.estado = :estado', { estado: Estado.DISPONIBLE });
    }

    const empleados = await qb.orderBy('empleado.nombre', 'ASC').getMany();

    return {
      data: empleados.map((empleado) => ({
        id: empleado.id,
        no_empleado: empleado.no_empleado,
        nombre: empleado.nombre,
        apellido_paterno: empleado.apellido_paterno,
        apellido_materno: empleado.apellido_materno,
        puesto: empleado.puesto,
        departamento: empleado.departamento,
        estado: empleado.estado,
      })),
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
