import { PartialType } from '@nestjs/mapped-types';
import { CreateSeguimientoViajeDto } from './create-seguimiento_viaje.dto';

export class UpdateSeguimientoViajeDto extends PartialType(CreateSeguimientoViajeDto) {}
