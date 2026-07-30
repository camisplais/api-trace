import { Injectable } from '@nestjs/common';
import { CreateEmbarqueDto } from './dto/create-embarque.dto';
import { UpdateEmbarqueDto } from './dto/update-embarque.dto';

@Injectable()
export class EmbarquesService {
  create(createEmbarqueDto: CreateEmbarqueDto) {
    return 'This action adds a new embarque';
  }

  findAll() {
    return `This action returns all embarques`;
  }

  findOne(id: number) {
    return `This action returns a #${id} embarque`;
  }

  update(id: number, updateEmbarqueDto: UpdateEmbarqueDto) {
    return `This action updates a #${id} embarque`;
  }

  remove(id: number) {
    return `This action removes a #${id} embarque`;
  }
}
