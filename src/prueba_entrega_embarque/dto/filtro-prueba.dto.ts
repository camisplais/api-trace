// dto/filtro-pruebas.dto.ts
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsDateString, Min } from 'class-validator';

export class FiltroPruebasDto {
  @Type(() => Number)
  @IsInt()
  cliente_id: number;

  @IsOptional() @IsString()
  search?: string;

  @IsOptional() @IsString()
  tipo?: string;

  @IsOptional() @Type(() => Number) @IsInt()
  anio?: number;

  @IsOptional() @Type(() => Number) @IsInt()
  mes?: number;

  @IsOptional() @IsDateString()
  fecha_inicio?: string;

  @IsOptional() @IsDateString()
  fecha_fin?: string;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page?: number = 1;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  limit?: number = 10;
}