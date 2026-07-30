import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

export enum Evento
{
    LOGIN_EXITOSO='login_exitoso',
    LOGOUT='logout',
    OTP_EXPIRADO='otp_expirado',
    OTP_INCORRECTO='otp_incorrecto',
    PASSWORD_INCORRECTO='password_incorrecto'
}

@Entity('auditoria_log')

export class AuditoriaLog
{
    @PrimaryGeneratedColumn({type:'bigint', unsigned:true})
    id!: number;

    @ManyToOne(() => Usuario, { eager: true })
    @JoinColumn({ name: 'usuario_id' })
    usuario?: Usuario;

    @Column({ type: 'enum', enum:Evento})
    evento!: Evento;
    
    @Column({ type: 'varchar', length:15})
    ip!: string;
    
    @CreateDateColumn()
    createdAt!: Date;
    
}
