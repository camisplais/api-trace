import {Tipo} from '../enums/tipo.enum';
import {Estado} from '../enums/estado.enum';

export interface ImportEmbarqueDto {
    plan_embarque: string;
    fecha: string;
    hora: string;
    tipo: Tipo;
    tarima: number;
    cantidad_piezas: number;
    estado: Estado;
}

export interface ImportEmbarqueRow {
  fila: number;
  datos: ImportEmbarqueDto | null;
  errores: string[];
}

export function parseTipo(valor: string): Tipo | null {
  const valorNormalizado = valor?.trim().toLowerCase();
  return Object.values(Tipo).includes(valorNormalizado as Tipo)
    ? (valorNormalizado as Tipo)
    : null;
}

export function parseEstado(valor: string): Estado | null {
  const valorNormalizado = valor?.trim().toLowerCase();
  return Object.values(Estado).includes(valorNormalizado as Estado)
    ? (valorNormalizado as Estado)
    : null;
}