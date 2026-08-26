import { DataSource } from 'typeorm';
import { Transporte, Estado } from 'src/transportes/entities/transporte.entity';

export async function seedTransportes(dataSource: DataSource) {
  const repo = dataSource.getRepository(Transporte);

  const transportes: Partial<Transporte>[] = [
    {
      placas: 'ABC-1234',
      marca: 'Kenworth',
      carga_util: '15000.00',
      estado: Estado.PLANTA,
    },
    {
      placas: 'XYZ-5678',
      marca: 'Freightliner',
      carga_util: '18000.00',
      estado: Estado.VIAJE,
    },
    {
      placas: 'JKL-9012',
      marca: 'Volvo',
      carga_util: '20000.00',
      estado: Estado.PLANTA,
    },
    {
      placas: 'MNO-3456',
      marca: 'Scania',
      carga_util: '17500.00',
      estado: Estado.VIAJE,
    },
    {
      placas: 'PQR-7890',
      marca: 'Mercedes-Benz',
      carga_util: '16000.00',
      estado: Estado.PLANTA,
    },
    {
      placas: 'STU-1122',
      marca: 'International',
      carga_util: '15500.00',
      estado: Estado.VIAJE,
    },
    {
      placas: 'VWX-3344',
      marca: 'MAN',
      carga_util: '19000.00',
      estado: Estado.PLANTA,
    },
    {
      placas: 'YZA-5566',
      marca: 'Isuzu',
      carga_util: '14000.00',
      estado: Estado.VIAJE,
    },
    {
      placas: 'BCD-7788',
      marca: 'Hino',
      carga_util: '13000.00',
      estado: Estado.PLANTA,
    },
    {
      placas: 'EFG-9900',
      marca: 'DAF',
      carga_util: '18500.00',
      estado: Estado.PLANTA,
    },
  ];

  for (const transporte of transportes) {
    const exists = await repo.findOne({ where: { placas: transporte.placas } });
    if (!exists) {
      await repo.save(repo.create(transporte));
    }
  }
  console.log('transportes ok');
}
