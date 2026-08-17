import { DataSource } from 'typeorm';
import { ViajeEmbarque } from 'src/viaje_embarque/entities/viaje_embarque.entity';
import { Viaje } from 'src/viajes/entities/viaje.entity';
import { Embarque } from 'src/embarques/entities/embarque.entity';

export async function seedViajeEmbarque(dataSource: DataSource) {
  const viajeEmbarqueRepo = dataSource.getRepository(ViajeEmbarque);
  const viajeRepo = dataSource.getRepository(Viaje);
  const embarqueRepo = dataSource.getRepository(Embarque);

  const viajes = await viajeRepo.find({ order: { id: 'ASC' } });
  const embarques = await embarqueRepo.find({ order: { id: 'ASC' } });

  if (viajes.length === 0 || embarques.length === 0) {
    console.warn(
      'No hay viajes o embarques en la BD. Corre esos seeds primero.',
    );
    return;
  }

  // Iterar sobre los embarques garantiza que NINGÚN embarque se repita en 2 viajes
  for (let i = 0; i < embarques.length; i++) {
    const embarque = embarques[i];
    // Reparte circularmente: los embarques 0 a 7 van a los viajes 0 a 7,
    // y los embarques 8 y 9 van a los viajes 0 y 1 (dando 2 embarques a esos 2 viajes).
    const viaje = viajes[i % viajes.length];

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

  console.log('viaje_embarque ok');
}