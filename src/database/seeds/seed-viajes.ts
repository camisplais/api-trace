import { DataSource, In } from 'typeorm';
import { Viaje } from 'src/viajes/entities/viaje.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { Transporte } from 'src/transportes/entities/transporte.entity';

export async function seedViajes(dataSource: DataSource) {
  const viajeRepo = dataSource.getRepository(Viaje);
  const empleadoRepo = dataSource.getRepository(Empleado);
  const transporteRepo = dataSource.getRepository(Transporte);

  // Obtener únicamente chóferes con IDs 5 y 11
  const choferes = await empleadoRepo.find({
    where: { id: In([5, 11]) },
    order: { id: 'ASC' },
  });

  // Obtener únicamente empleados de embarque con IDs 3, 6 y 7
  const empleadosEmbarque = await empleadoRepo.find({
    where: { id: In([3, 6, 7]) },
    order: { id: 'ASC' },
  });

  // Obtener únicamente transportes con IDs 1, 3, 5, 7 y 9
  const transportes = await transporteRepo.find({
    where: { id: In([2, 4, 6, 8]) },
    order: { id: 'ASC' },
  });

  if (
    choferes.length === 0 ||
    empleadosEmbarque.length === 0 ||
    transportes.length === 0
  ) {
    console.warn(
      'Faltan chóferes (IDs 5, 11), empleados de embarque (IDs 3, 6, 7) o transportes (IDs 1, 3, 5, 7, 9). Corre esos seeds primero.',
    );
    return;
  }

  const CANTIDAD = 8;

  const existentes = await viajeRepo.count();
  if (existentes >= CANTIDAD) {
    console.log('viajes ya poblados, se omite');
    return;
  }

  for (let i = existentes; i < CANTIDAD; i++) {
    const empleado_chofer = choferes[i % choferes.length];
    const empleado_embarque = empleadosEmbarque[i % empleadosEmbarque.length];
    const transporte = transportes[i % transportes.length];

    await viajeRepo.save(
      viajeRepo.create({ empleado_chofer, empleado_embarque, transporte }),
    );
  }

  console.log('viajes ok');
}