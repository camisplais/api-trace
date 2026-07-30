import { PartialType } from '@nestjs/mapped-types';
import { CreateDocClienteDto } from './create-doc_cliente.dto';

export class UpdateDocClienteDto extends PartialType(CreateDocClienteDto) {}
