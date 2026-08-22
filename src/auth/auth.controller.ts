import { UseGuards,Controller, Get, Post, Query, Req, Res,NotFoundException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { SessionGuard } from '../auth/session.guard';
import { TokenAuthGuard } from './token.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
    
  ) {}

  // --- Inicia el login: arma PKCE y redirige al IdP ---
  @Get('login')
  login(@Res() res: Response) {
    const { verifier, challenge } = this.authService.generarPkce();
    const state = this.authService.generarState();

    // Guardamos verifier y state en cookies temporales (para el callback)
    res.cookie('pkce_verifier', verifier, {
      httpOnly: true, sameSite: 'lax', maxAge: 600000, // 10 min
    });
    res.cookie('oauth_state', state, {
      httpOnly: true, sameSite: 'lax', maxAge: 600000,
    });

    const url = this.authService.construirUrlAutorizacion(challenge, state);
    return res.redirect(url);
  }

  // --- Recibe el code, lo canjea, guarda sesion, pone cookie ---
  @Get('callback')
  async callback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // Validar el state
    const savedState = req.cookies?.oauth_state;
    if (!state || state !== savedState) {
      return res.status(400).send('state inválido');
    }

    const verifier = req.cookies?.pkce_verifier;
    if (!verifier) {
      return res.status(400).send('falta el verifier');
    }

    try {
      // Canjear el code por tokens
      const tokens = await this.authService.canjearCode(code, verifier);

      // Guardar la sesion
      const sessionId = await this.authService.crearSesion(tokens);

      // Limpiar cookies temporales
      res.clearCookie('pkce_verifier');
      res.clearCookie('oauth_state');

      // Poner la cookie de sesion (la llave del casillero)
      res.cookie('sid', sessionId, {
        httpOnly: true, secure: false, sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
      });

      // Redirigir al front-negocio, ya logueado
      const frontUrl = this.config.get('FRONT_NEGOCIO_URL');
      return res.redirect(frontUrl);
    } catch (e) {
      console.error('Error en callback:', e);
      return res.status(500).send('Error al iniciar sesión');
    }
  }

  @Get('me')
  @UseGuards(SessionGuard)
  async me(@CurrentUser() user: { id: string }) {
    const info = await this.authService.getInfoUsuario(user.id);
    if (!info) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return info;
  }

  @Get('me-app')
  @UseGuards(TokenAuthGuard)
  async meApp(@CurrentUser() user: { id: string }) {
    const info = await this.authService.getInfoUsuario(user.id);
    if (!info) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return info;
  }
  
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const sessionId = req.cookies?.sid;
    if (sessionId) {
      await this.authService.borrarSesion(sessionId);
    }
    res.clearCookie('sid');
    return res.json({ ok: true });
  }
}