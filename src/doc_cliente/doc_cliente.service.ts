import { Injectable } from '@nestjs/common';
import { CreateDocClienteDto } from './dto/create-doc_cliente.dto';
import { UpdateDocClienteDto } from './dto/update-doc_cliente.dto';

@Injectable()
export class DocClienteService {
  create(createDocClienteDto: CreateDocClienteDto) {
    return 'This action adds a new docCliente';
  }

  findAll() {
    return `This action returns all docCliente`;
  }

  findOne(id: number) {
    return `This action returns a #${id} docCliente`;
  }

  update(id: number, updateDocClienteDto: UpdateDocClienteDto) {
    return `This action updates a #${id} docCliente`;
  }

  remove(id: number) {
    return `This action removes a #${id} docCliente`;
  }
}
