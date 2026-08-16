import {
  IsString,
  IsNotEmpty,
  IsNumberString,
  MaxLength,
} from 'class-validator';

export class CreateTransporteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  marca!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  placas!: string;

  // Llega como string en el form-data (multipart). Se guarda como decimal.
  @IsNumberString({}, { message: 'carga_util debe ser un valor numérico' })
  @IsNotEmpty()
  carga_util!: string;
}