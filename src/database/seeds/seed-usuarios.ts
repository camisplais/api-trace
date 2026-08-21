import { DataSource } from 'typeorm';
import { Usuario, Estado } from 'src/usuarios/entities/usuario.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';
import * as bcrypt from 'bcrypt';

// Función para limpiar acentos y caracteres especiales
function limpiarTexto(texto: string): string {
  return (texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z]/g, ''); // Deja solo letras de la a-z
}

// Función para generar username de exactamente 8 caracteres
function generarUsername8Chars(nombre: string, apellidoPaterno: string, apellidoMaterno?: string): string {
  const nomClean = limpiarTexto(nombre);
  const patClean = limpiarTexto(apellidoPaterno);
  const matClean = limpiarTexto(apellidoMaterno || '');

  // 1ª letra del nombre
  const inicialNombre = nomClean.charAt(0);

  // Concatenar apellido paterno y materno
  const apellidos = patClean + matClean;

  // Tomar los siguientes 7 caracteres de los apellidos
  const resto = apellidos.substring(0, 7);

  // Si aún con ambos apellidos no junta 7 caracteres, rellenar con 'x'
  return (inicialNombre + resto).padEnd(8, 'x');
}

export async function seedUsuarios(dataSource: DataSource) {
  const repo = dataSource.getRepository(Usuario);
  const roleRepo = dataSource.getRepository(Role);
  const empleadoRepo = dataSource.getRepository(Empleado);

  // 1. Cargar roles existentes
  const roles = await roleRepo.find();
  const getRol = (nombre: string) => roles.find((r) => r.nombre === nombre)!;

  // 2. Cargar únicamente el empleado de Camila (no_empleado 1008 / ID 8)
  const empleadoCamila = await empleadoRepo.findOne({ where: { no_empleado: 1008 } });

  // 3. Usuario manual exclusivo para Camila
  if (empleadoCamila) {
    const existeCamila = await repo.findOne({
      where: [{ username: 'camisplay' }, { empleado: { id: empleadoCamila.id } }],
    });

    if (!existeCamila) {
      const usuarioCamila: Partial<Usuario> = {
        rol: getRol('Coordinador Stock'),
        empleado: empleadoCamila,
        username: 'camisplay',
        password: await bcrypt.hash('password123', 10),
        celular: '8717888054',
        email: 'camis@clayens.com',
        estado: Estado.ACTIVO,
      };
      await repo.save(repo.create(usuarioCamila));
    }
  }

  // 4. Mapeo de puesto -> rol
  const mapaRoles: Record<string, string> = {
    'Embarques': 'Embarques',
    'Guardia de Caseta': 'Caseta',
    'Customer Service': 'Customer Service',
    'Coordinador Stock': 'Coordinador Stock',
    'Chofer': 'Chofer',
    'Aduanas': 'Aduanas',
  };

  const defaultPassword = await bcrypt.hash('password123', 10);
  const todosLosEmpleados = await empleadoRepo.find();

  // 5. Generar dinámicamente los usuarios restantes
  for (const emp of todosLosEmpleados) {
    // Si ya tiene usuario (como Camila), se salta
    const yaTieneUsuario = await repo.findOne({ where: { empleado: { id: emp.id } } });
    if (yaTieneUsuario) continue;

    const nombreRol = mapaRoles[emp.puesto] || 'Embarques';
    const rolAsignado = getRol(nombreRol) || roles[0];

    // Generar username de 8 caracteres (inicial + 7 caracteres de apellidos)
    const username8 = generarUsername8Chars(emp.nombre, emp.apellido_paterno, emp.apellido_materno);

    const primerNombre = limpiarTexto(emp.nombre.split(' ')[0]);
    const primerApellido = limpiarTexto(emp.apellido_paterno);

    const nuevoUsuario: Partial<Usuario> = {
      empleado: emp,
      rol: rolAsignado,
      username: username8,
      password: defaultPassword,
      celular: `871${String(emp.no_empleado).padStart(7, '0')}`,
      email: `${primerNombre}.${primerApellido}@clayens.com`,
      estado: Estado.ACTIVO,
    };

    const existeUsername = await repo.findOne({ where: { username: nuevoUsuario.username } });
    if (!existeUsername) {
      await repo.save(repo.create(nuevoUsuario));
    }
  }

  console.log('usuarios ok');
}