import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

// Segun el diseno (EDITAR TRANSPORTE) solo son editables la placa y la imagen.
// La imagen se recibe como archivo (no como campo del body), por eso no va aqui.
export class UpdateTransporteDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  placas?: string;
}