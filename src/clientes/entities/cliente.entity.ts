import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { DocCliente } from 'src/doc_cliente/entities/doc_cliente.entity';
import { Embarque } from 'src/embarques/entities/embarque.entity';

export enum Tipo
{
    MEDICO='medico',
    AUTOMOTRIZ='automotriz',
    AEROESPACIAL='aeroespacial',
    ELECTRICO='electrico',
}

@Entity('clientes')

export class Cliente
{
  @PrimaryGeneratedColumn({type:'smallint', unsigned:true})
  id!: number;

  @Column({ type: 'varchar', length:45})
  nombre!: string;

  @Column({ type: 'enum', enum:Tipo})
  tipo!: Tipo;

  @Column({ type: 'varchar', length:45})
  ubicacion!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => DocCliente, (docCliente) => docCliente.cliente)
  docClientes!: DocCliente[];

  @OneToMany(() => Embarque, (embarque) => embarque.cliente)
  embarques!: Embarque[];

}
