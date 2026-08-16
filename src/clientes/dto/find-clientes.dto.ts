import { IsOptional, IsEnum, IsString, IsNumberString } from 'class-validator';
import { Tipo } from '../entities/cliente.entity';

export class FindClientesDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  per_page?: string;

  @IsOptional()
  @IsEnum(Tipo)
  tipo?: Tipo;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  ciudad?: string;
}