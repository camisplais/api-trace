import { IsInt } from 'class-validator';

export class CrearViajeDto {
  @IsInt()
  empleado_chofer_id!: number;

  @IsInt()
  transporte_id!: number;

  @IsInt()
  embarque_id!: number; // un solo embarque al crear
}