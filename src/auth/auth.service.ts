import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Sesion } from './entities/sesion.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { AppException } from 'src/common/errors/app.exception';
import { Not } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Sesion)
    private readonly sesionRepo: Repository<Sesion>,
    private readonly config: ConfigService,

    @InjectRepository(Usuario)
      private readonly usuariosRepo: Repository<Usuario>,
      private readonly usuariosService: UsuariosService,
  ) {}

  // --- PKCE: genera el verifier y su challenge ---
  generarPkce() {
    const verifier = crypto.randomBytes(32).toString('base64url');
    const challenge = crypto
      .createHash('sha256')
      .update(verifier)
      .digest('base64url');
    return { verifier, challenge };
  }

  generarState(): string {
    return crypto.randomBytes(16).toString('base64url');
  }

  // --- Construye la URL del /authorize del IdP ---
  construirUrlAutorizacion(challenge: string, state: string): string {
    const idpUrl = this.config.get('IDP_URL');
    const clientId = this.config.get('IDP_CLIENT_ID');
    const redirectUri = this.config.get('IDP_REDIRECT_URI');

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid profile offline_access',
      state,
      code_challenge: challenge,
      code_challenge_method: 'S256',
    });

    return `${idpUrl}/oidc/auth?${params.toString()}`;
  }

  // --- Canjea el code por los tokens (llama al /token del IdP) ---
  async canjearCode(code: string, verifier: string) {
    const idpUrl = this.config.get('IDP_URL');
    const clientId = this.config.get('IDP_CLIENT_ID');
    const clientSecret = this.config.get('IDP_CLIENT_SECRET');
    const redirectUri = this.config.get('IDP_REDIRECT_URI');

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
      code_verifier: verifier,
    });

    const res = await fetch(`${idpUrl}/oidc/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error('Error al canjear el code: ' + err);
    }

    const tokens = await res.json();
    console.log('>>> TOKENS del IdP:', JSON.stringify(tokens, null, 2));   // <- AGREGA ESTO
    return tokens;
  }

  // --- Guarda la sesion y devuelve el sessionId ---
  async crearSesion(tokens: any): Promise<string> {
    const sessionId = crypto.randomUUID();

    // Sacamos el userId (sub) del id_token
    const userId = this.extraerSub(tokens.id_token);

    const sesion = this.sesionRepo.create({
      id: sessionId,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token ?? null,
      userId,
      expiraEn: new Date(Date.now() + tokens.expires_in * 1000),
      creadaEn: new Date(),
    });
    await this.sesionRepo.save(sesion);

    return sessionId;
  }

  // --- Lee una sesion por su id (el de la cookie) ---
  async obtenerSesion(sessionId: string): Promise<Sesion | null> {
    if (!sessionId) return null;
    return this.sesionRepo.findOne({ where: { id: sessionId } });
  }

  // --- Borra una sesion (logout) ---
  async borrarSesion(sessionId: string): Promise<void> {
    await this.sesionRepo.delete({ id: sessionId });
  }

  // --- Helper: saca el 'sub' del id_token (sin verificar firma, solo leer) ---
  private extraerSub(idToken: string): string {
    const payload = idToken.split('.')[1];
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return decoded.sub;
  }

  // --- Renueva los tokens usando el refresh token ---
  async renovarConRefresh(refreshToken: string) {
    const idpUrl = this.config.get('IDP_URL');
    const clientId = this.config.get('IDP_CLIENT_ID');
    const clientSecret = this.config.get('IDP_CLIENT_SECRET');

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
    });

    const res = await fetch(`${idpUrl}/oidc/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!res.ok) {
      // El refresh token expiró o es inválido
      throw new Error('No se pudo renovar el token');
    }

    return res.json(); // { access_token, refresh_token?, expires_in, ... }
  }

  // --- Actualiza una sesion existente con tokens nuevos (mismo registro) ---
  async actualizarSesion(sessionId: string, tokens: any): Promise<void> {
    await this.sesionRepo.update(
      { id: sessionId },
      {
        accessToken: tokens.access_token,
        // Si el IdP rota el refresh token, guardamos el nuevo; si no, dejamos el viejo
        ...(tokens.refresh_token ? { refreshToken: tokens.refresh_token } : {}),
        expiraEn: new Date(Date.now() + tokens.expires_in * 1000),
      },
    );
  }

  async getInfoUsuario(userId: string) {
    const usuario = await this.usuariosRepo.findOne({
      where: { id: Number(userId) },
      relations: this.usuariosService.relacionesUsuario,
    });

    if (!usuario) return null;

    return this.usuariosService.toResponse(usuario);
  }

    //el propio actualiza su propio: username y/o celular
  async updateUser(userId: number, username?: string, password?: string) {
      const usuario = await this.usuariosRepo.findOne({
        where: this.usuariosService.relacionesUsuario,
      });
      if (!usuario) {
        throw new AppException('VAL_RECORD_NOT_FOUND', { record: 'Usuario' });
      }
  
      if (username !== undefined) {
        if (username.length < 8) throw new AppException('VAL_USERNAME');
  
        const tomado = await this.usuariosRepo.findOne({
          where: { username, id: Not(usuario.id) },
        });
        if (tomado) throw new AppException('VAL_DUPLICATE_FIELD', { fieldName: 'username' });
  
        usuario.username = username;
      }
   
      await this.usuariosRepo.save(usuario);
  
      return this.usuariosService.toResponse(usuario);
    }

        //el propio actualiza su propio: contraseña
  async updateUserPassword(userId: number, password?: string) {
    const usuario = await this.usuariosRepo.findOne({
      where: { id: userId },
      select: {
      id: true,
      username: true,
      password: true,
      },
    });
    if (!usuario) {
      throw new AppException('VAL_RECORD_NOT_FOUND', { record: 'Usuario' });
    }

    if (password !== undefined) {
      if (password.length < 8) throw new AppException('VAL_PASSWORD_LONG');
      if (!/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).+$/.test(password)) {
        throw new AppException('VAL_PASSWORD_COMPLEXITY');
      }

      const esIgualALaActual = await bcrypt.compare(password, usuario.password);
      if (esIgualALaActual) {
        throw new AppException('VAL_CHANGE_PASSWORD');
      }

      usuario.password = await this.hashPassword(password);
    }

    await this.usuariosRepo.save(usuario);

    return {
      message: 'Contraseña actualizada'
    };
  }

    async hashPassword(passwordPlano: string): Promise<string> {
        return bcrypt.hash(passwordPlano, 10);
    }

}