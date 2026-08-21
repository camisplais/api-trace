import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { parse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';
import { AppException } from 'src/common/errors/app.exception';
import { ImportEmbarqueDto, ImportEmbarqueRow, parseTipo, parseEstado } from './dto/import-embarque.dto';
import { Multer } from 'multer';
import { InjectDataSource, InjectRepository  } from '@nestjs/typeorm';
import { Embarque, Estado } from './entities/embarque.entity';
import { In, Repository, DataSource } from 'typeorm';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { ConfirmarImportEmbarquesDto } from './dto/confirmar-import-embarques.dto';
import { DocCliente } from 'src/doc_cliente/entities/doc_cliente.entity';
import { FiltroEmbarquesDto } from './dto/filtro-embarques.dto';

const EXPECTED_COLUMNS = [
  'plan_embarque',
  'fecha',
  'hora',
  'tipo',
  'tarima',
  'cantidad_piezas'
];

const EXTENSIONES_PERMITIDAS = ['.csv', '.xls', '.xlsx'];

const empleado_temp = 1;

interface FilaEmbarque {
  plan_embarque: string;
  fecha: string;
  hora: string;
  tipo: string;
  tarima: string | number;
  cantidad_piezas: string | number;
}

@Injectable()
export class EmbarquesService {
  constructor(
    @InjectRepository(Embarque) private readonly embarqueRepository: Repository<Embarque>,
    @InjectRepository(Cliente) private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Empleado) private readonly empleadoRepository: Repository<Empleado>,
    @InjectRepository(DocCliente) private readonly docClienteRepo: Repository<DocCliente>,
    @InjectDataSource() private readonly dataSource: DataSource
  ) {}

  async importarArchivo(file: Express.Multer.File) {
    if (!file) {
      throw new AppException('VAL_REQUIRED_FIELD', { fieldName: 'file' });
    }

    const nombreArchivo = file.originalname.toLowerCase();
    const extension = EXTENSIONES_PERMITIDAS.find((ext) =>
      nombreArchivo.endsWith(ext),
    );

    if (!extension) {
      throw new AppException('FILE_INVALID_TYPE');
    }

    let rows: FilaEmbarque[];

    try {
      rows = extension === '.csv'
        ? this.parsearCsv(file.buffer)
        : this.parsearExcel(file.buffer);
    } catch {
      console.log('Error al parsear el archivo, asegúrese de que el contenido sea válido.');
      throw new AppException('FILE_INVALID_CONTENT');
      
    }

    if (rows.length === 0) {
      console.log('El archivo está vacío o no contiene datos válidos.');
      throw new AppException('FILE_INVALID_CONTENT');
      
    }

    const columns = Object.keys(rows[0]);
    const missingColumns = EXPECTED_COLUMNS.filter((c) => !columns.includes(c));
    const extraColumns = columns.filter((c) => !EXPECTED_COLUMNS.includes(c));

    if (missingColumns.length > 0 || extraColumns.length > 0) {
      console.log(`Columnas faltantes: ${missingColumns.join(', ')}`);
      console.log(`Columnas extra: ${extraColumns.join(', ')}`);
      throw new AppException('FILE_INVALID_CONTENT');
      
    }

    const data: ImportEmbarqueRow[] = rows.map((row, index) =>
      this.validarFila(row, index),
    );

    return { data, msg: null };
  }

  private parsearCsv(buffer: Buffer): FilaEmbarque[] {
    const csvContent = buffer.toString('utf-8');
    return parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as FilaEmbarque[];
  }

  private parsearExcel(buffer: Buffer): FilaEmbarque[] {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const primeraHoja = workbook.SheetNames[0];
    const hoja = workbook.Sheets[primeraHoja];

    // raw: false convierte todo a string (igual que vendría de un CSV)
    // defval: '' evita que celdas vacías queden como undefined
    return XLSX.utils.sheet_to_json<FilaEmbarque>(hoja, {
      raw: false,
      defval: '',
    });
  }

  private validarFila(row: FilaEmbarque, index: number): ImportEmbarqueRow {
    const errores: string[] = [];

    if (!row.plan_embarque) errores.push('plan_embarque es obligatorio');
    if (!row.fecha) errores.push('fecha es obligatoria');
    if (!row.hora) errores.push('hora es obligatoria');

    const tipo = parseTipo(String(row.tipo));
    if (!row.tipo) {
      errores.push('tipo es obligatorio');
    } else if (tipo === null) {
      errores.push(`tipo inválido: "${row.tipo}" (valores permitidos: expeditado, regular)`);
    }

    const tarima = Number(row.tarima);
    if (!row.tarima || Number.isNaN(tarima) || tarima < 0) {
      errores.push('tarima debe ser un número válido');
    }

    const cantidadPiezas = Number(row.cantidad_piezas);
    if (!row.cantidad_piezas || Number.isNaN(cantidadPiezas) || cantidadPiezas < 0) {
      errores.push('cantidad_piezas debe ser un número válido');
    }


    const datos: ImportEmbarqueDto | null =
      errores.length === 0
        ? {
            plan_embarque: row.plan_embarque,
            fecha: row.fecha,
            hora: row.hora,
            tipo: tipo!,
            tarima,
            cantidad_piezas: cantidadPiezas,
          }
        : null;

    return { fila: index + 2, datos, errores };
  }

  async confirmarImportacion(dto: ConfirmarImportEmbarquesDto) {
     const clienteIds = [...new Set(dto.embarques.map((e) => e.cliente_id))];

     const [clientes, empleadoCustomer] = await Promise.all([
      this.clienteRepository.findBy({ id: In(clienteIds) }),
      this.empleadoRepository.findOneBy({ id: empleado_temp }), 
    ]);

    const clienteMap = new Map(clientes.map((c) => [c.id, c]));

    const clientesFaltantes = clienteIds.filter((id) => !clienteMap.has(id));

    if (clientesFaltantes.length > 0) {
          throw new AppException('VAL_RECORD_NOT_FOUND', {
            record: 'cliente_id',
          } );
        }
    if (!empleadoCustomer) {
      throw new AppException('VAL_RECORD_NOT_FOUND', { record: 'empleado_id'});
    }

    return this.dataSource.transaction(async (manager) => {
      const embarques = dto.embarques.map((item) =>
        manager.create(Embarque, {
          cliente: clienteMap.get(item.cliente_id),
          empleado_customer: empleadoCustomer,
          plan_embarque: item.plan_embarque,
          fecha: new Date(item.fecha),
          hora: item.hora,
          tipo: item.tipo,
          tarima: item.tarima,
          cantidad_piezas: item.cantidad_piezas,
          estado: Estado.ACTIVO,
        }),
      );
      const guardados = await manager.save(Embarque, embarques);

      return manager.find(Embarque, {
      where: { id: In(guardados.map((e) => e.id)) },
      relations: {
        cliente: true,
        empleado: true,
      },
      });
    });
  }

  async findAllFiltrado(filtros: FiltroEmbarquesDto) {
    const { page = 1, limit = 5 } = filtros;

    // 1. Obtener la fecha de hoy en formato YYYY-MM-DD local (evita desfases UTC)
    const ahora = new Date();
    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');
    const hoyStr = `${anio}-${mes}-${dia}`; // Ejemplo: "2026-08-19"

    // 2. Usar los filtros o la fecha local de hoy
    const fechaDesde = filtros.fecha_desde ? filtros.fecha_desde : hoyStr;
    const fechaHasta = filtros.fecha_hasta ? filtros.fecha_hasta : hoyStr;

    const query = this.embarqueRepository
      .createQueryBuilder('embarque')
      .leftJoinAndSelect('embarque.cliente', 'cliente')
      .leftJoinAndSelect('embarque.empleado', 'empleado');

    if (filtros.cliente_id) {
      query.andWhere('cliente.id = :clienteId', { clienteId: filtros.cliente_id });
    }

    if (filtros.empleado_id) {
      query.andWhere('empleado.id = :empleadoId', { empleadoId: filtros.empleado_id });
    }

    if (filtros.estado) {
      query.andWhere('embarque.estado = :estado', { estado: filtros.estado });
    }

    if (filtros.tipo) {
      query.andWhere('embarque.tipo = :tipo', { tipo: filtros.tipo });
    }

    if (filtros.sin_viaje) {
    query
      .leftJoin('viaje_embarque', 've', 've.embarque_id = embarque.id')
      .andWhere('ve.id IS NULL');
    }

    // 3. Comparación directa por fecha (truncando horas si existen)
    query.andWhere('DATE(embarque.createdAt) >= :fechaDesde', { fechaDesde });
    query.andWhere('DATE(embarque.createdAt) <= :fechaHasta', { fechaHasta });

    query
      .orderBy('embarque.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await query.getManyAndCount();
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  
    async getDocumentosRequeridos(embarqueId: number) {
    const embarque = await this.embarqueRepository.findOne({
      where: { id: embarqueId },
    });

    if (!embarque) {
      throw new NotFoundException(`Embarque ${embarqueId} no encontrado`);
    }

    const docCliente = await this.docClienteRepo.find({
      where: { cliente: { id: embarque.cliente.id } },
    });

    return docCliente.map((dc) => ({
      doc_cliente_id: dc.id,
      nombre: dc.documento.nombre,
    }));
  }
  
  create(createEmbarqueDto: any) {
    return 'This action adds a new embarque';
  }

  findAll() {
    return `This action returns all embarques`;
  }
  findOne(id: number) {
    return `This action returns a #${id} embarque`;
  }
  update(id: number, updateEmbarqueDto: any) {
    return `This action updates a #${id} embarque`;
  }
  remove(id: number) {
    return `This action removes a #${id} embarque`;
  }
}