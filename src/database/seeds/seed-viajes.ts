import { DataSource } from 'typeorm';
import { Viaje } from 'src/viajes/entities/viaje.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { Transporte } from 'src/transportes/entities/transporte.entity';

export async function seedViajes(dataSource: DataSource) {
  const viajeRepo = dataSource.getRepository(Viaje);
  const empleadoRepo = dataSource.getRepository(Empleado);
  const transporteRepo = dataSource.getRepository(Transporte);

  const empleados = await empleadoRepo.find();
  const transportes = await transporteRepo.find();

  if (empleados.length === 0 || transportes.length === 0) {
    console.warn(
      'No hay empleados o transportes en la BD. Corre esos seeds primero.',
    );
    return;
  }

  // choferes: por puesto; el resto sirve como empleado de embarque
  const choferes = empleados.filter((e) =>
    e.puesto.toLowerCase().includes('chofer'),
  );
  const noChoferes = empleados.filter(
    (e) => !e.puesto.toLowerCase().includes('chofer'),
  );

  if (choferes.length === 0 || noChoferes.length === 0) {
    console.warn(
      'Faltan choferes o empleados de embarque para armar viajes.',
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
    const empleado_embarque = noChoferes[i % noChoferes.length];
    const transporte = transportes[i % transportes.length];

    await viajeRepo.save(
      viajeRepo.create({ empleado_chofer, empleado_embarque, transporte }),
    );
  }

  console.log('viajes ok');
}
