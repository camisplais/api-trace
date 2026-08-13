import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';
import { AppException } from 'src/common/errors/app.exception';
import { ImportEmbarqueDto, ImportEmbarqueRow, parseTipo, parseEstado } from './dto/import-embarque.dto';
import { Multer } from 'multer';

const EXPECTED_COLUMNS = [
  'plan_embarque',
  'fecha',
  'hora',
  'tipo',
  'tarima',
  'cantidad_piezas',
  'estado',
];

const EXTENSIONES_PERMITIDAS = ['.csv', '.xls', '.xlsx'];

interface FilaEmbarque {
  plan_embarque: string;
  fecha: string;
  hora: string;
  tipo: string;
  tarima: string | number;
  cantidad_piezas: string | number;
  estado: string;
}

@Injectable()
export class EmbarquesService {

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
      throw new AppException('FILE_INVALID_CONTENT');
    }

    if (rows.length === 0) {
      throw new AppException('FILE_INVALID_CONTENT');
    }

    const columns = Object.keys(rows[0]);
    const missingColumns = EXPECTED_COLUMNS.filter((c) => !columns.includes(c));
    const extraColumns = columns.filter((c) => !EXPECTED_COLUMNS.includes(c));

    if (missingColumns.length > 0 || extraColumns.length > 0) {
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

    const estado = parseEstado(String(row.estado));
    if (!row.estado) {
      errores.push('estado es obligatorio');
    } else if (estado === null) {
      errores.push(`estado inválido: "${row.estado}" (valores permitidos: activo, inactivo)`);
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
            estado: estado!,
          }
        : null;

    return { fila: index + 2, datos, errores };
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