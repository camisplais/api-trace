import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne,OneToOne,OneToMany,JoinColumn } from 'typeorm';
import { Viaje } from 'src/viajes/entities/viaje.entity';
import { Embarque } from 'src/embarques/entities/embarque.entity';
import { Solicitude } from 'src/solicitudes/entities/solicitude.entity';

@Entity('viaje_embarque')

export class ViajeEmbarque
{
  @PrimaryGeneratedColumn({type:'int', unsigned:true})
  id!: number;

  @ManyToOne(() => Viaje, { eager: true })
  @JoinColumn({ name: 'viaje_id' })
  viaje!: Viaje;

  @ManyToOne(() => Embarque, { eager: true })
  @JoinColumn({ name: 'embarque_id' })
  embarque!: Embarque;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Solicitude, (solicitud) => solicitud.viaje_embarque)
  solicitudes!: Solicitude[];
}
