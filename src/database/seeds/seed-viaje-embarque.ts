import { DataSource } from 'typeorm';
import { ViajeEmbarque } from 'src/viaje_embarque/entities/viaje_embarque.entity';
import { Viaje } from 'src/viajes/entities/viaje.entity';
import { Embarque } from 'src/embarques/entities/embarque.entity';

export async function seedViajeEmbarque(dataSource: DataSource) {
  const viajeEmbarqueRepo = dataSource.getRepository(ViajeEmbarque);
  const viajeRepo = dataSource.getRepository(Viaje);
  const embarqueRepo = dataSource.getRepository(Embarque);

  const viajes = await viajeRepo.find();
  const embarques = await embarqueRepo.find();

  if (viajes.length === 0 || embarques.length === 0) {
    console.warn(
      'No hay viajes o embarques en la BD. Corre esos seeds primero.',
    );
    return;
  }

  // asigna embarques a viajes de forma repartida (~1-2 embarques por viaje)
  let embarqueIdx = 0;

  for (const viaje of viajes) {
    const cuantos = (viaje.id % 2) + 1; // 1 o 2 embarques

    for (let k = 0; k < cuantos; k++) {
      const embarque = embarques[embarqueIdx % embarques.length];
      embarqueIdx++;

      const exists = await viajeEmbarqueRepo.findOne({
        where: {
          viaje: { id: viaje.id },
          embarque: { id: embarque.id },
        },
      });
      if (exists) continue;

      await viajeEmbarqueRepo.save(
        viajeEmbarqueRepo.create({ viaje, embarque }),
      );
    }
  }

  console.log('viaje_embarque ok');
}
