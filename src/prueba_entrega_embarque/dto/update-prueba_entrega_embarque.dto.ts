import { PartialType } from '@nestjs/mapped-types';
import { CreatePruebaEntregaEmbarqueDto } from './create-prueba_entrega_embarque.dto';

export class UpdatePruebaEntregaEmbarqueDto extends PartialType(CreatePruebaEntregaEmbarqueDto) {}
