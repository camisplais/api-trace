import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";
import { Tipo } from "../enums/tipo.enum";
import { Estado } from "../enums/estado.enum";

export class CreateEmbarqueDto {
 @IsInt()
 cliente_id!: number;

@IsString()
@IsNotEmpty()
plan_embarque!: string;

 @IsString()
 @IsNotEmpty()
 fecha!: string;

 @IsString()
 @IsNotEmpty()
 hora!: string;

 @IsEnum(Tipo, { message: 'tipo debe ser "expeditado" o "regular"' })
 tipo!: Tipo;

 @IsNumber()
 @Min(0)
 tarima!: number;
 
 @IsNumber()
 @Min(0)
 cantidad_piezas!: number;

}
