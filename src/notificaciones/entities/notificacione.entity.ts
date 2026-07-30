import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne,OneToOne,OneToMany,JoinColumn } from 'typeorm';
import { Solicitude } from 'src/solicitudes/entities/solicitude.entity';

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

    @CreateDateColumn()
    createdAt!: Date;

   @UpdateDateColumn()
   updatedAt!: Date;

   @DeleteDateColumn()
   deletedAt?: Date;
}
