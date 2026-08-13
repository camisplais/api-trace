import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Cliente, Tipo } from './entities/cliente.entity';
import { Documento } from 'src/documentos/entities/documento.entity';
import { DocCliente } from 'src/doc_cliente/entities/doc_cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { AppException } from 'src/common/errors/app.exception';
import { FindClientesDto } from './dto/find-clientes.dto';

@Injectable()
export class ClientesService
{
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepo: Repository<Cliente>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createClienteDto: CreateClienteDto)
  {
    return this.dataSource.transaction(async (manager) => {
       const existente = await manager.findOne(Cliente, {
       where: { nombre: createClienteDto.nombre },
      });
      if (existente) {
        throw new AppException('VAL_DUPLICATE_FIELD', { fieldName: 'nombre' });
      }
      const cliente = manager.create(Cliente, createClienteDto);
      await manager.save(cliente);

      const documentos =
        cliente.tipo === Tipo.MEDICO
          ? await manager.find(Documento)
          : await manager.find(Documento, { where: { soloMedico: false } });

      const docClientes = documentos.map((documento) =>
        manager.create(DocCliente, { cliente, documento }),
      );
      await manager.save(docClientes);

      return {
        id: cliente.id,
        nombre: cliente.nombre,
        tipo: cliente.tipo,
        ubicacion: cliente.ubicacion,
        documentos: documentos.map((doc) => ({
          id: doc.id,
          nombre: doc.nombre,
        })),
      };
    });
  }

async findAll(query: FindClientesDto) {
    const page = Number(query.page) || 1;
    const perPage = Number(query.per_page) || 20;

    const qb = this.clienteRepo
      .createQueryBuilder('cliente')
      .leftJoinAndSelect('cliente.docClientes', 'docCliente')
      .leftJoinAndSelect('docCliente.documento', 'documento');

    if (query.tipo) {
      qb.andWhere('cliente.tipo = :tipo', { tipo: query.tipo });
    }

    if (query.search) {
      qb.andWhere('cliente.nombre LIKE :search', { search: `%${query.search}%` });
    }

    qb.orderBy('cliente.id', 'DESC')
      .skip((page - 1) * perPage)
      .take(perPage);

    const [clientes, total] = await qb.getManyAndCount();

    return {
      data: clientes.map((cliente) => ({
        id: cliente.id,
        nombre: cliente.nombre,
        tipo: cliente.tipo,
        ubicacion: cliente.ubicacion,
        documentos: cliente.docClientes.map((dc) => ({
          id: dc.documento.id,
          nombre: dc.documento.nombre,
        })),
      })),
      meta: {
        total,
        page,
        per_page: perPage,
        last_page: Math.ceil(total / perPage) || 1,
      },
    };
  }

  async findOne(id: number) {
    const cliente = await this.clienteRepo.findOne({
      where: { id },
      relations: { docClientes: { documento: true } },
    });
    if (!cliente) {
      throw new AppException('VAL_RECORD_NOT_FOUND', { record: 'Cliente' });
    }
    return {
      id: cliente.id,
      nombre: cliente.nombre,
      tipo: cliente.tipo,
      ubicacion: cliente.ubicacion,
      documentos: cliente.docClientes.map((dc) => ({
        id: dc.documento.id,
        nombre: dc.documento.nombre,
      })),
    };
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    return this.dataSource.transaction(async (manager) => {
      const cliente = await manager.findOne(Cliente, { where: { id } });
      if (!cliente) {
        throw new AppException('VAL_RECORD_NOT_FOUND', { record: 'Cliente' });
      }

      if (updateClienteDto.nombre !== cliente.nombre) {
        const existente = await manager.findOne(Cliente, {
          where: { nombre: updateClienteDto.nombre },
        });
        if (existente) {
          throw new AppException('VAL_DUPLICATE_FIELD', { fieldName: 'nombre' });
        }
      }

      cliente.nombre = updateClienteDto.nombre;
      await manager.save(cliente);

        const asignados = await manager.find(DocCliente, {
        where: { cliente: { id: cliente.id } },
      });

        return{
          id: cliente.id,
            nombre: cliente.nombre,
            tipo: cliente.tipo,
            ubicacion: cliente.ubicacion,
            documentos: asignados.map((dc) => ({
            id: dc.documento.id,
            nombre: dc.documento.nombre,
          })),
        };
    });
  }

  async remove(id: number) {
    const cliente = await this.clienteRepo.findOne({ where: { id } });
    if (!cliente) {
      throw new AppException('VAL_RECORD_NOT_FOUND', { record: 'Cliente' });
    }
    await this.clienteRepo.softDelete(id);
  }

}
