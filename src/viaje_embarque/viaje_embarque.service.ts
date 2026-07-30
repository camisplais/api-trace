import { Injectable } from '@nestjs/common';
import { CreateViajeEmbarqueDto } from './dto/create-viaje_embarque.dto';
import { UpdateViajeEmbarqueDto } from './dto/update-viaje_embarque.dto';

@Injectable()
export class ViajeEmbarqueService {
  create(createViajeEmbarqueDto: CreateViajeEmbarqueDto) {
    return 'This action adds a new viajeEmbarque';
  }

  findAll() {
    return `This action returns all viajeEmbarque`;
  }

  findOne(id: number) {
    return `This action returns a #${id} viajeEmbarque`;
  }

  update(id: number, updateViajeEmbarqueDto: UpdateViajeEmbarqueDto) {
    return `This action updates a #${id} viajeEmbarque`;
  }

  remove(id: number) {
    return `This action removes a #${id} viajeEmbarque`;
  }
}
