import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,DeleteDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Entity('otp_token')

export class OtpToken
{
    @PrimaryGeneratedColumn({type:'bigint', unsigned:true})
    id!: number;

    @OneToOne(() => Usuario, { eager: true })
    @JoinColumn({ name: 'usuario_id' })
    usuario!: Usuario;

    @Column({ type: 'varchar', length:6})
    codigo!: string;

    @Column({ type: 'datetime'})
    fecha_expiracion!: Date;

    @Column({ type: 'datetime', nullable:true})
    fecha_uso?: Date;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
    
    @DeleteDateColumn()
    deletedAt?: Date;
    
}
