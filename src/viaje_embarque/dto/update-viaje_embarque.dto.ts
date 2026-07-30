import { PartialType } from '@nestjs/mapped-types';
import { CreateViajeEmbarqueDto } from './create-viaje_embarque.dto';

export class UpdateViajeEmbarqueDto extends PartialType(CreateViajeEmbarqueDto) {}
