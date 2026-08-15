import { DataSource } from 'typeorm';
import { PruebaEntregaEmbarque } from 'src/prueba_entrega_embarque/entities/prueba_entrega_embarque.entity';
import { Embarque } from 'src/embarques/entities/embarque.entity';
import { DocCliente } from 'src/doc_cliente/entities/doc_cliente.entity';

export async function seedPruebaEntregaEmbarque(dataSource: DataSource) {
  const pruebaRepo = dataSource.getRepository(PruebaEntregaEmbarque);
  const embarqueRepo = dataSource.getRepository(Embarque);
  const docClienteRepo = dataSource.getRepository(DocCliente);

  const embarques = await embarqueRepo.find();
  const docClientes = await docClienteRepo.find();

  if (embarques.length === 0 || docClientes.length === 0) {
    console.warn(
      'No hay embarques o doc_cliente en la BD. Corre esos seeds primero.',
    );
    return;
  }

  for (const embarque of embarques) {
    // documentos que pertenecen al mismo cliente del embarque
    const docsDelCliente = docClientes.filter(
      (dc) => dc.cliente?.id === embarque.cliente?.id,
    );

    // si por algún motivo no hay match, se salta este embarque
    if (docsDelCliente.length === 0) continue;

    // genera una prueba por cada documento del cliente (evita duplicados)
    for (const docCliente of docsDelCliente) {
      const exists = await pruebaRepo.findOne({
        where: {
          embarque: { id: embarque.id },
          docCliente: { id: docCliente.id },
        },
      });
      if (exists) continue;

      await pruebaRepo.save(
        pruebaRepo.create({
          embarque,
          docCliente,
          ruta_imagen: `pruebas/embarque_${embarque.id}_doc_${docCliente.id}.jpg`,
        }),
      );
    }
  }

  console.log('prueba_entrega_embarque ok');
}
