import { IsOptional, IsEnum } from 'class-validator';
import { Estado } from '../entities/transporte.entity';

export class FindTransportesDto {
  @IsOptional()
  @IsEnum(Estado)
  estado?: Estado;
}