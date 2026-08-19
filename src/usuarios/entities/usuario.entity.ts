import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne,OneToOne,OneToMany,JoinColumn } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { OtpToken } from 'src/otp_token/entities/otp_token.entity';
import { AuditoriaLog } from 'src/auditoria_log/entities/auditoria_log.entity';

export enum Estado
{
    ACTIVO='activo',
    INACTIVO='inactivo',
}

@Entity('usuarios')

export class Usuario
{
  @PrimaryGeneratedColumn({type:'mediumint', unsigned:true})
  id!: number;

  @ManyToOne(() => Role, { eager: true })
  @JoinColumn({ name: 'rol_id' })
  rol!: Role;

  @OneToOne(() => Empleado, { eager: true })
  @JoinColumn({ name: 'empleado_id' })
  empleado!: Empleado;

  @Column({ type: 'varchar', length:20})
  username!: string;

  @Column({ type: 'varchar', length:255})
  password!: string;

  @Column({ type: 'varchar', length:10})
  celular!: string;

  @Column({ type: 'varchar', length:30})
  email!: string;

  @Column({ type: 'enum', enum:Estado, default:Estado.ACTIVO})
  estado!: Estado;

  @OneToOne(() => OtpToken, (otpToken) => otpToken.usuario)
  otpToken?: OtpToken;

  @OneToMany(() => AuditoriaLog, (auditoriaLog) => auditoriaLog.usuario)
  auditoriaLogs!: AuditoriaLog[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
