import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne,OneToOne,OneToMany,JoinColumn } from 'typeorm';
import { Embarque } from 'src/embarques/entities/embarque.entity';
import { DocCliente } from 'src/doc_cliente/entities/doc_cliente.entity';

@Entity('prueba_entrega_embarque')

export class PruebaEntregaEmbarque
{
  @PrimaryGeneratedColumn({type:'int', unsigned:true})
  id!: number;

  @ManyToOne(() => Embarque, { eager: true })
  @JoinColumn({ name: 'embarque_id' })
  embarque!: Embarque;

  @ManyToOne(() => DocCliente, { eager: true })
  @JoinColumn({ name: 'doc_cliente_id' })
  docCliente!: DocCliente;

  @Column({ type: 'varchar', length:255})
  ruta_imagen!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

}
