import { IsString, IsNotEmpty, IsEnum, MaxLength } from 'class-validator';
import { Tipo } from '../entities/cliente.entity';

export class CreateClienteDto
{
  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  nombre!: string;

  @IsEnum(Tipo, {
    message: `tipo debe ser uno de los siguientes valores: ${Object.values(Tipo).join(', ')}`,
  })
  tipo!: Tipo;

  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  ubicacion!: string;
}
