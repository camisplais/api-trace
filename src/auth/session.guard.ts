import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    // 1. Leer la cookie sid
    const sessionId = req.cookies?.sid;
    if (!sessionId) {
      throw new UnauthorizedException('No autenticado');
    }

    // 2. Buscar la sesion
    const sesion = await this.authService.obtenerSesion(sessionId);
    if (!sesion) {
      throw new UnauthorizedException('Sesión no encontrada');
    }

    // 3. ¿El access token sigue vivo?
    const ahora = Date.now();
    const accessVivo = sesion.expiraEn.getTime() > ahora;

    if (accessVivo) {
      // Todo bien, adjuntamos el usuario y dejamos pasar
      (req as any).user = { id: sesion.userId };
      return true;
    }

    // 4. Access expiró. ¿Hay refresh token para renovar?
    if (!sesion.refreshToken) {
      await this.authService.borrarSesion(sessionId);
      throw new UnauthorizedException('Sesión expirada');
    }

    // 5. Intentar renovar con el refresh token
    try {
      const nuevosTokens = await this.authService.renovarConRefresh(
        sesion.refreshToken,
      );
      await this.authService.actualizarSesion(sessionId, nuevosTokens);

      (req as any).user = { id: sesion.userId };
      return true;
    } catch (e) {
      // El refresh token expiró: borramos la sesion, hay que re-login
      await this.authService.borrarSesion(sessionId);
      throw new UnauthorizedException('Sesión expirada, vuelve a iniciar sesión');
    }
  }
}