import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany,JoinColumn } from 'typeorm';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { PruebaEntregaEmbarque } from 'src/prueba_entrega_embarque/entities/prueba_entrega_embarque.entity';
import { ViajeEmbarque } from 'src/viaje_embarque/entities/viaje_embarque.entity';

export enum Tipo
{
    EXPEDITADO='expeditado',
    REGULAR='regular',
}

export enum Estado
{
    ACTIVO='activo',
    INACTIVO='inactivo',
}

@Entity('embarques')

export class Embarque
{
  @PrimaryGeneratedColumn({type:'int', unsigned:true})
  id!: number;

  @ManyToOne(() => Cliente, { eager: true })
  @JoinColumn({ name: 'cliente_id' })
  cliente!: Cliente;

  @ManyToOne(() => Empleado, { eager: true })
  @JoinColumn({ name: 'empleado_id' })
  empleado!: Empleado;

  @Column({ type: 'varchar', length:20})
  plan_embarque!: string;

  @Column({ type: 'date'})
  fecha!: Date;

  @Column({ type: 'time'})
  hora!: string;

  @Column({ type: 'enum', enum:Tipo})
  tipo!: Tipo;

  @Column({type:'smallint', unsigned:true})
  tarima!: number;

  @Column({type:'int', unsigned:true})
  cantidad_piezas!: number;

  @Column({ type: 'enum', enum:Estado})
  estado!: Estado

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => PruebaEntregaEmbarque, (prueba) => prueba.embarque)
  pruebasEntrega!: PruebaEntregaEmbarque[]

  @OneToMany(() => ViajeEmbarque, (viajeEmbarque) => viajeEmbarque.embarque)
  viajeEmbarques!: ViajeEmbarque[];

}
