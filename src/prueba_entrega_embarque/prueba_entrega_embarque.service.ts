import { Injectable } from '@nestjs/common';
import { CreatePruebaEntregaEmbarqueDto } from './dto/create-prueba_entrega_embarque.dto';
import { UpdatePruebaEntregaEmbarqueDto } from './dto/update-prueba_entrega_embarque.dto';

@Injectable()
export class PruebaEntregaEmbarqueService {
  create(createPruebaEntregaEmbarqueDto: CreatePruebaEntregaEmbarqueDto) {
    return 'This action adds a new pruebaEntregaEmbarque';
  }

  findAll() {
    return `This action returns all pruebaEntregaEmbarque`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pruebaEntregaEmbarque`;
  }

  update(id: number, updatePruebaEntregaEmbarqueDto: UpdatePruebaEntregaEmbarqueDto) {
    return `This action updates a #${id} pruebaEntregaEmbarque`;
  }

  remove(id: number) {
    return `This action removes a #${id} pruebaEntregaEmbarque`;
  }
}
