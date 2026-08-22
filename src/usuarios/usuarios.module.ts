import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuario } from './entities/usuario.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { Role } from 'src/roles/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Empleado, Role]),
    forwardRef(() => AuthModule), // 👈 lo trae de vuelta, pero sin recrear el crash del círculo
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
