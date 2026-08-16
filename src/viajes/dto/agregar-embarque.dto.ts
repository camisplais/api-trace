import { IsInt } from 'class-validator';

export class AgregarEmbarqueDto {
  @IsInt()
  embarque_id!: number;
}