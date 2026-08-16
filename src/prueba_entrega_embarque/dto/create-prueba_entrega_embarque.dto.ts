import { IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePruebaEntregaEmbarqueDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  embarque_id!: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  doc_cliente_id!: number;
}