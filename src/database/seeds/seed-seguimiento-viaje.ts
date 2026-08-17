import { DataSource, In } from 'typeorm';
import { SeguimientoViaje } from 'src/seguimiento_viaje/entities/seguimiento_viaje.entity';
import { Viaje } from 'src/viajes/entities/viaje.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';

export async function seedSeguimientoViaje(dataSource: DataSource) {
  const seguimientoRepo = dataSource.getRepository(SeguimientoViaje);
  const viajeRepo = dataSource.getRepository(Viaje);
  const empleadoRepo = dataSource.getRepository(Empleado);

  const viajes = await viajeRepo.find({ order: { id: 'ASC' } });

  // Empleados de caseta: IDs 9, 12 y 15
  const empleadosCaseta = await empleadoRepo.find({
    where: { id: In([9, 12, 15]) },
    order: { id: 'ASC' },
  });

  // Empleados QR salida: IDs 3, 6 y 7
  const empleadosQr = await empleadoRepo.find({
    where: { id: In([3, 6, 7]) },
    order: { id: 'ASC' },
  });

  // Empleado por asignar: ID 16
  const empleadoPorAsignar = await empleadoRepo.findOne({
    where: { id: 16 },
  });

  if (
    viajes.length === 0 ||
    empleadosCaseta.length === 0 ||
    empleadosQr.length === 0 ||
    !empleadoPorAsignar
  ) {
    console.warn(
      'Faltan viajes o empleados requeridos en la BD (Caseta: 9, 12, 15 | QR: 3, 6, 7 | Por Asignar: 16). Corre esos seeds primero.',
    );
    return;
  }

  for (let i = 0; i < viajes.length; i++) {
    const viaje = viajes[i];

    const exists = await seguimientoRepo.findOne({
      where: { viaje: { id: viaje.id } },
    });
    if (exists) continue;

    const empCasetaSalida = empleadosCaseta[i % empleadosCaseta.length];
    const empQrSalida = empleadosQr[i % empleadosQr.length];

    // Simulación: Los viajes con índice par ya regresaron; los impares siguen en ruta (sin entrada)
    const yaRegreso = i % 2 === 0;

    const fechaBase = new Date('2025-01-20');
    fechaBase.setDate(fechaBase.getDate() + i);

    const salida = new Date(fechaBase);
    salida.setHours(8 + (i % 4), 0, 0);

    let entrada: Date | undefined = undefined;
    let empCasetaEntrada = empleadoPorAsignar;

    if (yaRegreso) {
      entrada = new Date(fechaBase);
      entrada.setHours(14 + (i % 4), 30, 0);
      empCasetaEntrada = empleadosCaseta[(i + 1) % empleadosCaseta.length];
    }

    await seguimientoRepo.save(
      seguimientoRepo.create({
        viaje,
        empleado_caseta_salida: empCasetaSalida,
        empleado_qr_salida: empQrSalida,
        empleado_caseta_entrada: empCasetaEntrada,
        salida,
        entrada,
        qr: `QR-VIAJE-${String(viaje.id).padStart(4, '0')}`,
      }),
    );
  }

  console.log('seguimiento_viaje ok');
}