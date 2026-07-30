import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { DocCliente } from 'src/doc_cliente/entities/doc_cliente.entity';

@Entity('documentos')

export class Documento {

  @PrimaryGeneratedColumn({type:'tinyint', unsigned:true})
  id!: number;

  @Column({ type: 'varchar', length:40})
  nombre!: string;

  @Column({ type: 'varchar', length:100, nullable:true})
  descripcion?: string;

  @CreateDateColumn()
  createdAt!: Date;
  
  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => DocCliente, (docCliente) => docCliente.documento)
  docClientes!: DocCliente[];
}
