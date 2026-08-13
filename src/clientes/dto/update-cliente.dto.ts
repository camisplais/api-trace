import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateClienteDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(45)
  nombre!: string;
}