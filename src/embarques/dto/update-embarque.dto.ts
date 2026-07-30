import { PartialType } from '@nestjs/mapped-types';
import { CreateEmbarqueDto } from './create-embarque.dto';

export class UpdateEmbarqueDto extends PartialType(CreateEmbarqueDto) {}
