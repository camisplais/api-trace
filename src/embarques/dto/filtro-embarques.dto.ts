import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsInt, IsOptional, IsBoolean } from "class-validator";
import { Tipo } from "../enums/tipo.enum";
import { Estado } from "../enums/estado.enum";

export class FiltroEmbarquesDto {

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    cliente_id?: number;

    @IsOptional()
    @Type(()=>Number)
    @IsInt()
    empleado_id?: number;

    @IsOptional()
    @IsEnum(Tipo, { message: 'tipo debe ser "expeditado" o "regular"' })
    tipo?: Tipo;

    @IsOptional()
    @IsEnum(Estado, { message: 'estado debe ser "activo" o "inactivo"' })
    estado?: Estado;

    @IsOptional()
    @IsDateString()
    fecha_desde?: string;

    @IsOptional()
    @IsDateString()
    fecha_hasta?: string;  
    
    @IsOptional()
    @Type(()=>Number)
    @IsInt()
    page?: number = 1;

    @IsOptional()
    @Type(()=>Number)
    @IsInt()
    limit?: number = 5;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  sin_viaje?: boolean;
}