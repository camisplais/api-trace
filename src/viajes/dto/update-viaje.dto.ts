import { PartialType } from '@nestjs/mapped-types';
import { CrearViajeDto } from './create-viaje.dto';

export class UpdateViajeDto extends PartialType(CrearViajeDto) {}
