import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne,OneToOne,OneToMany,JoinColumn } from 'typeorm';
import { ViajeEmbarque } from 'src/viaje_embarque/entities/viaje_embarque.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { Notificacion } from 'src/notificaciones/entities/notificacione.entity';
import { Tipo } from '../enums/tipo.enum';
import { Estado } from '../enums/estado.enum';

@Entity('solicitudes')

export class Solicitude
{
  @PrimaryGeneratedColumn({type:'int', unsigned:true})
  id!: number;
  
  @ManyToOne(() => ViajeEmbarque, { eager: true })
  @JoinColumn({ name: 'viaje_embarque_id' })
  viaje_embarque!: ViajeEmbarque;

  @ManyToOne(() => Empleado, { eager: true })
  @JoinColumn({ name: 'empleado_emisor_id' })
  empleado_emisor!: Empleado;

  @ManyToOne(() => Empleado, { eager: true })
  @JoinColumn({ name: 'empleado_receptor_id' })
  empleado_receptor!: Empleado;

  @Column({ type: 'enum', enum:Tipo})
  tipo!: Tipo;

  @Column({ type: 'enum', enum:Estado, default:Estado.PENDIENTE})
  estado!: Estado;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToOne(() => Notificacion, (notificacion) => notificacion.solicitud)
  notificacion?: Notificacion;
}
