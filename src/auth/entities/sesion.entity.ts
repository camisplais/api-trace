import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('sesiones_bff')
export class Sesion {
  // El sessionId: esto es lo que va en la cookie del navegador.
  // Es un string aleatorio, la "llave del casillero".
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id!: string;

  // Los tokens que el BFF guarda del lado servidor (el navegador NO los ve)
  @Column({ type: 'text' })
  accessToken!: string;

  @Column({ type: 'text', nullable: true })
  refreshToken?: string | null;

  // Quien es el usuario (el sub del id_token)
  @Column({ type: 'varchar', length: 100 })
  userId!: string;

  // Cuando expira el access token (para saber cuando renovar)
  @Column({ type: 'datetime' })
  expiraEn!: Date;

  @Column({ type: 'datetime' })
  creadaEn!: Date;
}