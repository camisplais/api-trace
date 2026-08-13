import { IsOptional, IsNumberString } from 'class-validator';

export class FindViajesDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  per_page?: string;

  @IsOptional()
  @IsNumberString()
  empleado_chofer_id?: string;

  @IsOptional()
  @IsNumberString()
  transporte_id?: string;
}