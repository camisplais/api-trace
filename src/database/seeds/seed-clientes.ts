import { DataSource } from 'typeorm';
import { Cliente, Tipo } from 'src/clientes/entities/cliente.entity';

export async function seedClientes(dataSource: DataSource) {
  const repo = dataSource.getRepository(Cliente);

  const clientes: Partial<Cliente>[] = [
    {
      nombre: 'Autoliv Aguascalientes',
      tipo: Tipo.AUTOMOTRIZ, 
      ubicacion: 'Aguascalientes, Mexico', 
    },
    {
      nombre: 'Autoliv Matamoros',
      tipo: Tipo.AUTOMOTRIZ,
      ubicacion: 'Matamoros, Mexico',
    },
    {
      nombre: 'Autoliv Utah',
      tipo: Tipo.AUTOMOTRIZ,
      ubicacion: 'Utah, USA',
    },
    {
      nombre: 'Becton Dickinson France',
      tipo: Tipo.MEDICO,
      ubicacion: 'le Pont-de-Claix, Francia',
    },
    {
      nombre: 'Borgwarner',
      tipo: Tipo.AUTOMOTRIZ,
      ubicacion: 'Saltillo, Mexico',
    },
    {
      nombre: 'Electrical Insulation Suppliers',
      tipo: Tipo.ELECTRICO,
      ubicacion: 'Monterrey, Mexico',
    },
    {
      nombre: 'Fehrer',
      tipo: Tipo.AUTOMOTRIZ,
      ubicacion: 'Saltillo, Mexico',
    },
    {
      nombre: 'Magna Powertrain',
      tipo: Tipo.AUTOMOTRIZ,
      ubicacion: 'Ramos Arizpe, Mexico',
    },
    {
      nombre: 'Milwaukee tools',
      tipo: Tipo.ELECTRICO,
      ubicacion: 'Torreon, Mexico',
    },
    {
      nombre: 'Norma Michigan',
      tipo: Tipo.AUTOMOTRIZ,
      ubicacion: 'Michigan, USA',
    },
    {
      nombre: 'Ompi of America',
      tipo: Tipo.MEDICO,
      ubicacion: 'Pensilvania, USA',
    },
    {
      nombre: 'Radiall, USA',
      tipo: Tipo.ELECTRICO,
      ubicacion: 'Arizona, USA',
    },
    {
      nombre: 'Rotax Austria',
      tipo: Tipo.AEROESPACIAL,
      ubicacion: 'Gunskirchen, Austria',
    },
    {
      nombre: 'Schneider Canada',
      tipo: Tipo.ELECTRICO,
      ubicacion: 'Milton, Canada',
    },
    {
      nombre: 'Schneider Lexington',
      tipo: Tipo.ELECTRICO,
      ubicacion: 'Lexington, USA',
    },
    {
      nombre: 'Schneider Monterrey',
      tipo: Tipo.ELECTRICO,
      ubicacion: 'Monterrey, Mexico',
    },
    {
      nombre: 'Schneider Tijuana',
      tipo: Tipo.ELECTRICO,
      ubicacion: 'Tijuana, Mexico',
    },
    {
      nombre: 'Schneider Tlaxcala',
      tipo: Tipo.ELECTRICO,
      ubicacion: 'Tlaxcala, Mexico',
    },
    {
      nombre: 'Schneider Xicohtencatl',
      tipo: Tipo.ELECTRICO,
      ubicacion: 'Xicohtencatl, Mexico',
    },
    {
      nombre: 'Stabilus',
      tipo: Tipo.AUTOMOTRIZ,
      ubicacion: 'Ramos Arizpe, Coahuila',
    },
    {
      nombre: 'Te Sensors',
      tipo: Tipo.ELECTRICO,
      ubicacion: 'Pensilvania, USA',
    },
    {
      nombre: 'Therm-o Disc Juarez',
      tipo: Tipo.ELECTRICO,
      ubicacion: 'Juárez, Mexico',
    },
    {
      nombre: 'Ushin Irapuato',
      tipo: Tipo.AUTOMOTRIZ,
      ubicacion: 'Irapuato, Mexico',
    },
    {
      nombre: 'Valeo Hamilton',
      tipo: Tipo.AUTOMOTRIZ,
      ubicacion: 'Hamilton, USA',
    },
    {
      nombre: 'Yazaki',
      tipo: Tipo.AUTOMOTRIZ,
      ubicacion: 'Torreon, Mexico',
    },
  ];

  for (const cliente of clientes) {
    const exists = await repo.findOne({ where: { nombre: cliente.nombre } });
    if (!exists) {
      await repo.save(repo.create(cliente));
    }
  }
  console.log('clientes ok');
}