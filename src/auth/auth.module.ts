import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionGuard } from './session.guard'; // 👈 importá el guard
import { Sesion } from './entities/sesion.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { WhatsappModule } from 'src/common/whatsapp/whatsapp.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sesion, Usuario]),
    forwardRef(() => UsuariosModule), // 👈 forwardRef, porque se necesitan mutuamente
    WhatsappModule
  ],
  controllers: [AuthController],
  providers: [AuthService, SessionGuard],       // 👈 registrá el guard
  exports: [AuthService, SessionGuard],         // 👈 exportalo para que Usuarios lo use
})
export class AuthModule {}