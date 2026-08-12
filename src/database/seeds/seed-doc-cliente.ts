import { DataSource } from 'typeorm';
import { DocCliente } from 'src/doc_cliente/entities/doc_cliente.entity';
import { Documento } from 'src/documentos/entities/documento.entity';
import { Cliente, Tipo } from 'src/clientes/entities/cliente.entity';

const DOCUMENTOS_GENERALES = [
  'Factura',
  'Packing list / Albaran',
  'Remision manual',
  'Fotografia',
  'Certificado de calidad',
];

const DOCUMENTOS_MEDICOS = [
  'Certificado de conformidad',
  'Certificado de analisis',
  'Checklist de revision de producto',
  'Checklist de transportista',
  'Compromiso de transportista',
  'Listado de verificacion de salida',
  'Certificado de fumigacion',
];

export async function seedDocCliente(dataSource: DataSource) {
  const docClienteRepo = dataSource.getRepository(DocCliente);
  const documentoRepo = dataSource.getRepository(Documento);
  const clienteRepo = dataSource.getRepository(Cliente);

  const clientes = await clienteRepo.find();
  const documentos = await documentoRepo.find();

  if (clientes.length === 0 || documentos.length === 0) {
    console.warn('No hay clientes o documentos en la BD. Corre esos seeds primero.');
    return;
  }

  for (const cliente of clientes) {
    // Todos los clientes llevan los documentos generales
    const nombresDocumentos = [...DOCUMENTOS_GENERALES];

    // Solo los clientes de tipo MEDICO llevan los documentos adicionales
    if (cliente.tipo === Tipo.MEDICO) {
      nombresDocumentos.push(...DOCUMENTOS_MEDICOS);
    }

    for (const nombreDoc of nombresDocumentos) {
      const documento = documentos.find((d) => d.nombre === nombreDoc);

      if (!documento) {
        console.warn(`Documento "${nombreDoc}" no encontrado, se omite.`);
        continue;
      }

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