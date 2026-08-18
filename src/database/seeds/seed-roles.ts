import { DataSource } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';

export async function seedRoles(dataSource: DataSource) {
  const repo = dataSource.getRepository(Role);

  const roles: Partial<Role>[] = [
    { id: 1, nombre: 'Embarques' },
    { id: 2, nombre: 'Caseta' },
    { id: 3, nombre: 'Customer Service' },
    { id: 4, nombre: 'Coordinador Stock' },
    { id: 5, nombre: 'Chofer' },
    { id: 6, nombre: 'Aduanas' },
  ];

  for (const rol of roles) {
    const exists = await repo.findOne({ where: { id: rol.id } });
    if (!exists) {
      await repo.save(repo.create(rol));
    }
  }
  console.log('roles ok');
}
