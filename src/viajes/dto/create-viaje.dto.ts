import { IsInt } from 'class-validator';

export class CrearViajeDto {
  @IsInt()
  empleado_chofer_id!: number;

  @IsInt()
  transporte_id!: number;

  @IsInt()
  empleado_embarque_id!: number; // luego se saca del token

  @IsInt()
  embarque_id!: number; // un solo embarque al crear
}