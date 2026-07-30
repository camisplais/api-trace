import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

export enum Dispositivo
{
    MOVIL='movil',
    WEB='web',
}

@Entity('refresh_token')

export class RefreshToken
{
     @PrimaryGeneratedColumn({type:'bigint', unsigned:true})
      id!: number;

      @ManyToOne(() => Usuario, { eager: true })
      @JoinColumn({ name: 'usuario_id' })
      usuario!: Usuario;
    
      @Column({ type: 'varchar', length:255})
      token!: string;

      @Column({ type: 'datetime'})
      fecha_expiracion!: Date;

      @Column({ type: 'datetime', nullable:true})
      fecha_revocacion?: Date;

      @Column({ type: 'enum', enum:Dispositivo, nullable:true})
      dispositivo?: Dispositivo;
    
      @CreateDateColumn()
      createdAt!: Date;
    
      @UpdateDateColumn()
      updatedAt!: Date;
    
      @DeleteDateColumn()
      deletedAt?: Date;
}
