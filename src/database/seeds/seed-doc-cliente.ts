import { DataSource } from 'typeorm';
import { DocCliente } from 'src/doc_cliente/entities/doc_cliente.entity';
import { Documento } from 'src/documentos/entities/documento.entity';
import { Cliente, Tipo } from 'src/clientes/entities/cliente.entity';

export async function seedDocCliente(dataSource: DataSource) {
  const docClienteRepo = dataSource.getRepository(DocCliente);
  const documentoRepo = dataSource.getRepository(Documento);
  const clienteRepo = dataSource.getRepository(Cliente);

  const clientes = await clienteRepo.find();
  const documentos = await documentoRepo.find();

  if (clientes.length === 0 || documentos.length === 0) {
    console.warn(
      'No hay clientes o documentos en la BD. Corre esos seeds primero.',
    );
    return;
  }

  for (const cliente of clientes) {
    const documentosAsignar =
      cliente.tipo === Tipo.MEDICO
        ? documentos
        : documentos.filter((d) => !d.soloMedico);

    for (const documento of documentosAsignar) {
      const exists = await docClienteRepo.findOne({
        where: {
          cliente: { id: cliente.id },
          documento: { id: documento.id },
        },
      });

      if (!exists) {
        await docClienteRepo.save(
          docClienteRepo.create({ cliente, documento }),
        );
      }
    }
  }

  console.log('doc_cliente ok');
}