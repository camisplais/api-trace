import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Documento } from './entities/documento.entity';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';

@Injectable()
export class DocumentosService {
  constructor(
    @InjectRepository(Documento)
    private readonly documentoRepo: Repository<Documento>,
  ) {}

  create(createDocumentoDto: CreateDocumentoDto) {
    return 'This action adds a new documento';
  }

  // Catálogo de pruebas de entrega. Lo consume el front para mostrar,
  // según el tipo de cliente, qué pruebas se asignan (soloMedico).
  async findAll() {
    const documentos = await this.documentoRepo.find({ order: { id: 'ASC' } });
    return {
      data: documentos.map((d) => ({
        id: d.id,
        nombre: d.nombre,
        descripcion: d.descripcion ?? null,
        soloMedico: d.soloMedico ?? false,
      })),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} documento`;
  }

  update(id: number, updateDocumentoDto: UpdateDocumentoDto) {
    return `This action updates a #${id} documento`;
  }

  remove(id: number) {
    return `This action removes a #${id} documento`;
  }
}
