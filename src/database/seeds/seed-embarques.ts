import { DataSource } from 'typeorm';
import { Embarque, Tipo, Estado } from 'src/embarques/entities/embarque.entity';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';

export async function seedEmbarques(dataSource: DataSource) {
  const embarqueRepo = dataSource.getRepository(Embarque);
  const clienteRepo = dataSource.getRepository(Cliente);
  const empleadoRepo = dataSource.getRepository(Empleado);

  const clientes = await clienteRepo.find();
  const empleados = await empleadoRepo.find();

  if (clientes.length === 0 || empleados.length === 0) {
    console.warn(
      'No hay clientes o empleados en la BD. Corre esos seeds primero.',
    );
    return;
  }

  // datos base de cada embarque; cliente y empleado se asignan por índice
  const base: Array<Partial<Embarque> & { plan_embarque: string }> = [
    { plan_embarque: 'PLAN-0001', fecha: new Date('2025-01-10'), hora: '08:30:00', tipo: Tipo.REGULAR, tarima: 4, cantidad_piezas: 120, estado: Estado.ACTIVO },
    { plan_embarque: 'PLAN-0002', fecha: new Date('2025-01-11'), hora: '09:15:00', tipo: Tipo.EXPEDITADO, tarima: 2, cantidad_piezas: 60, estado: Estado.ACTIVO },
    { plan_embarque: 'PLAN-0003', fecha: new Date('2025-01-12'), hora: '10:00:00', tipo: Tipo.REGULAR, tarima: 6, cantidad_piezas: 200, estado: Estado.ACTIVO },
    { plan_embarque: 'PLAN-0004', fecha: new Date('2025-01-13'), hora: '11:45:00', tipo: Tipo.REGULAR, tarima: 3, cantidad_piezas: 90, estado: Estado.INACTIVO },
    { plan_embarque: 'PLAN-0005', fecha: new Date('2025-01-14'), hora: '07:50:00', tipo: Tipo.EXPEDITADO, tarima: 1, cantidad_piezas: 30, estado: Estado.ACTIVO },
    { plan_embarque: 'PLAN-0006', fecha: new Date('2025-01-15'), hora: '13:20:00', tipo: Tipo.REGULAR, tarima: 5, cantidad_piezas: 150, estado: Estado.ACTIVO },
    { plan_embarque: 'PLAN-0007', fecha: new Date('2025-01-16'), hora: '14:10:00', tipo: Tipo.EXPEDITADO, tarima: 2, cantidad_piezas: 45, estado: Estado.ACTIVO },
    { plan_embarque: 'PLAN-0008', fecha: new Date('2025-01-17'), hora: '15:00:00', tipo: Tipo.REGULAR, tarima: 4, cantidad_piezas: 110, estado: Estado.INACTIVO },
    { plan_embarque: 'PLAN-0009', fecha: new Date('2025-01-18'), hora: '08:05:00', tipo: Tipo.REGULAR, tarima: 7, cantidad_piezas: 220, estado: Estado.ACTIVO },
    { plan_embarque: 'PLAN-0010', fecha: new Date('2025-01-19'), hora: '16:30:00', tipo: Tipo.EXPEDITADO, tarima: 1, cantidad_piezas: 25, estado: Estado.ACTIVO },
  ];

  for (let i = 0; i < base.length; i++) {
    const datos = base[i];
    const exists = await embarqueRepo.findOne({
      where: { plan_embarque: datos.plan_embarque },
    });
    if (exists) continue;

    const cliente = clientes[i % clientes.length];
    const empleado = empleados[i % empleados.length];

    await embarqueRepo.save(
      embarqueRepo.create({ ...datos, cliente, empleado }),
    );
  }

  console.log('embarques ok');
}
