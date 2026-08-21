import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, ValidateIf } from "class-validator";
import { Tipo } from "../enums/tipo.enum";

export class CreateSolicitudeDto {

    @IsInt()
    viaje_embarque_id!: number;

    @IsEnum(Tipo, {message: "tipo invalido" })
    tipo!: Tipo;

    @IsOptional()
    @IsInt()
    empleado_receptor_id?: number;

    @ValidateIf((dto) => dto.tipo === Tipo.PE_PENDIENTES)
    @IsString()
    @IsNotEmpty({message: "El campo motivo es obligatorio para solicitudes de tipo PE_PENDIENTES"})
    motivo!: string;
}
