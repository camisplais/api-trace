import { IsEnum, IsInt, IsOptional } from "class-validator";
import { Tipo } from "../enums/tipo.enum";

export class CreateSolicitudeDto {

    @IsInt()
    viaje_embarque_id!: number;

    @IsEnum(Tipo, {message: "tipo invalido" })
    tipo!: Tipo;

    @IsOptional()
    @IsInt()
    empleado_receptor_id?: number;
}
