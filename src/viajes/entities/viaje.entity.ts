import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne,OneToOne,OneToMany,JoinColumn } from 'typeorm';
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { Transporte } from 'src/transportes/entities/transporte.entity';
import { SeguimientoViaje } from 'src/seguimiento_viaje/entities/seguimiento_viaje.entity';
import { ViajeEmbarque } from 'src/viaje_embarque/entities/viaje_embarque.entity';

@Entity('viajes')

export class Viaje
{
    @PrimaryGeneratedColumn({type:'int', unsigned:true})
    id!: number;
    
    @ManyToOne(() => Empleado, { eager: true })
    @JoinColumn({ name: 'empleado_chofer_id' })
    empleado_chofer!: Empleado;

    @ManyToOne(() => Empleado, { eager: true })
    @JoinColumn({ name: 'empleado_embarque_id' })
    empleado_embarque!: Empleado;

    @ManyToOne(() => Transporte, { eager: true })
    @JoinColumn({ name: 'transporte_id' })
    transporte!: Transporte;

   @CreateDateColumn()
   createdAt!: Date;

   @UpdateDateColumn()
   updatedAt!: Date;

   @DeleteDateColumn()
   deletedAt?: Date;

   @OneToOne(() => SeguimientoViaje, (seguimiento) => seguimiento.viaje)
   seguimiento?: SeguimientoViaje;

  @OneToMany(() => ViajeEmbarque, (viajeEmbarque) => viajeEmbarque.viaje)
  viajeEmbarques!: ViajeEmbarque[];
}
