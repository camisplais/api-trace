import { IsOptional, IsNumberString, IsDateString } from 'class-validator';

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

  @IsOptional()
  @IsDateString()
  fecha_desde?: string;
  
  @IsOptional()
  @IsDateString()
  fecha_hasta?: string;  
}