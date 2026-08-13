import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Cliente, Tipo } from './entities/cliente.entity';
import { Documento } from 'src/documentos/entities/documento.entity';
import { DocCliente } from 'src/doc_cliente/entities/doc_cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { AppException } from 'src/common/errors/app.exception';

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
        throw new AppException(
          'VAL_DUPLICATE_FIELD',
          'nombre ya existente, debe ser único',
        );
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

  findAll() {
    return `This action returns all clientes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cliente`;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    return this.dataSource.transaction(async (manager) => {
      const cliente = await manager.findOne(Cliente, { where: { id } });
      if (!cliente) {
        throw new AppException('VAL_RECORD_NOT_FOUND', 'Cliente no encontrado');
      }

      if (updateClienteDto.nombre !== cliente.nombre) {
        const existente = await manager.findOne(Cliente, {
          where: { nombre: updateClienteDto.nombre },
        });
        if (existente) {
          throw new AppException(
            'VAL_DUPLICATE_FIELD',
            'nombre ya existente, debe ser único',
          );
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

}
