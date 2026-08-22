import { UseGuards,Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { SessionGuard } from '../auth/session.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('empleado/:empleadoId')
  @UseGuards(SessionGuard)
  async createUser(
    @Param('empleadoId') empleadoId: number,
    @Body() body: { username: string; password: string; rol_id: number },
  ) {
    return this.usuariosService.createUser(
      empleadoId,
      body.username,
      body.password,
      body.rol_id,
    );
  }

  @Get('empleado')
  @UseGuards(SessionGuard)
  findAll() {
    return this.usuariosService.findAllUsers();
  }

  @Get(':id')
  @UseGuards(SessionGuard)
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(+id);
  }

  /**
   * Edicion del admin: username y/o celular.
   * OJO: antes este handler mandaba `body.password` al parametro `telefono`
   * del service, asi que la contrasena nunca se actualizaba y ademas
   * reventaba con VAL_PHONE. Ahora el body es { username?, telefono? }.
   */
  @Patch('empleado/:empleadoId')
  @UseGuards(SessionGuard)
  async updateUser(
    @Param('empleadoId') empleadoId: number,
    @Body() body: { username?: string; telefono?: string },
  ) {
    return this.usuariosService.updateUser(
      empleadoId,
      body.username,
      body.telefono,
    );
  }

  /**
   * El service ya tenia `updateUserPassword` pero no habia ruta que lo llamara.
   * Va aparte porque cambiar contrasena tiene sus propias validaciones
   * (complejidad + no repetir la actual).
   */
  @Patch('empleado/:empleadoId/password')
  @UseGuards(SessionGuard)
  async updateUserPassword(
    @Param('empleadoId') empleadoId: number,
    @Body() body: { password: string },
  ) {
    return this.usuariosService.updateUserPassword(empleadoId, body.password);
  }
}
