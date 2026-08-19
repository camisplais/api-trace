import { DataSource } from 'typeorm';
import { Usuario, Estado } from 'src/usuarios/entities/usuario.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';

export async function seedUsuarios(dataSource: DataSource) {
  const repo = dataSource.getRepository(Usuario);
  const roleRepo = dataSource.getRepository(Role);
  const empleadoRepo = dataSource.getRepository(Empleado);

  // Buscar roles y empleados ya insertados
  const embarquesRole = await roleRepo.findOne({ where: { nombre: 'Embarques' } });
  const choferRole = await roleRepo.findOne({ where: { nombre: 'Chofer' } });
  const csRole = await roleRepo.findOne({ where: { nombre: 'Customer Service' } });

  const empleado1 = await empleadoRepo.findOne({ where: { no_empleado: 1001 } });
  const empleado2 = await empleadoRepo.findOne({ where: { no_empleado: 1002 } });
  const empleado3 = await empleadoRepo.findOne({ where: { no_empleado: 1010 } });
  const empleado4 = await empleadoRepo.findOne({ where: { no_empleado: 1008 } });

  const usuarios: Partial<Usuario>[] = [
    {
      rol: embarquesRole!,
      empleado: empleado1!,
      username: 'juanp',
      password: 'password123', // ⚠️ usar bcrypt en producción
      celular: '8711111111',
      email: 'juanp@empresa.com',
      estado: Estado.ACTIVO,
    },
    {
      rol: choferRole!,
      empleado: empleado2!,
      username: 'mariaL',
      password: 'password123',
      celular: '8712222222',
      email: 'marial@empresa.com',
      estado: Estado.ACTIVO,
    },
    {
      rol: csRole!,
      empleado: empleado3!,
      username: 'patriciaN',
      password: 'password123',
      celular: '8713333333',
      email: 'patrician@empresa.com',
      estado: Estado.INACTIVO,
    },
    {
      rol: csRole!,
      empleado: empleado4!,
      username: 'camisplay',
      password: 'password123',
      celular: '8717888054',
      email: 'camis@empresa.com',
      estado: Estado.INACTIVO,
    },
  ];

  for (const usuario of usuarios) {
    const exists = await repo.findOne({ where: { username: usuario.username } });
    if (!exists) {
      await repo.save(repo.create(usuario));
    }
  }
  console.log('usuarios ok');
}
