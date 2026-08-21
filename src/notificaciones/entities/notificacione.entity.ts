import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne,OneToOne,OneToMany,JoinColumn } from 'typeorm';
import { Solicitude } from 'src/solicitudes/entities/solicitude.entity';
import { Estado } from '../enums/estado.enum';

@Entity('notificaciones')

export class Notificacion
{
    @PrimaryGeneratedColumn({type:'int', unsigned:true})
    id!: number;
    
    @OneToOne(() => Solicitude, { eager: true })
    @JoinColumn({ name: 'solicitud_id' })
    solicitud!: Solicitude;
    
    @Column({ type: 'varchar', length:30})
    notificacion!: string;

    @Column({ type: 'enum', enum: Estado, default: Estado.NO_LEIDA })
    estado!: Estado;

    @CreateDateColumn()
    createdAt!: Date;

   @UpdateDateColumn()
   updatedAt!: Date;

   @DeleteDateColumn()
   deletedAt?: Date;
}
