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
    @Body() body: { username: string; password: string },
  ) {
    return this.usuariosService.createUser(
      empleadoId,
      body.username,
      body.password,
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

  @Patch('empleado/:empleadoId')
  @UseGuards(SessionGuard)
  async updateUser(
    @Param('empleadoId') empleadoId: number,
    @Body() body: { username: string; password: string },
  ) {
    return this.usuariosService.updateUser(
      empleadoId,
      body.username,
      body.password,
    );
  }

}
