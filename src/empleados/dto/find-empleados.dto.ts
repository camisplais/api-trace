import { IsOptional, IsEnum, IsNumberString } from 'class-validator';
import { Departamento, Estado } from '../entities/empleado.entity';

export class FindEmpleadosDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  per_page?: string;

  @IsOptional()
  @IsEnum(Departamento)
  departamento?: Departamento;

  @IsOptional()
  @IsEnum(Estado)
  estado?: Estado;
}