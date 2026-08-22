import { IsOptional, IsEnum, IsNumberString, IsString } from 'class-validator';
import { Departamento, Estado } from '../entities/empleado.entity';

export class FindEmpleadosDto {
  /** Texto libre: busca por no. de empleado, nombre o apellidos. */
  @IsOptional()
  @IsString()
  search?: string;

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
