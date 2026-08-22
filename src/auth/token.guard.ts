import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class TokenAuthGuard implements CanActivate {
  private readonly userinfoUrl = 'http://192.168.1.12:3000/oidc/me';

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Falta el token Bearer');
    }

    const token = authHeader.substring(7);

    // userinfo espera GET + Bearer (NO post, NO basic)
    const resp = await fetch(this.userinfoUrl, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!resp.ok) {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    const claims = await resp.json();

    (req as any).user = { id: claims.sub };
    return true;
  }
}