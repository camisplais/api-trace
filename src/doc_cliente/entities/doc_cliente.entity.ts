import { Entity, Column, PrimaryGeneratedColumn, ManyToOne,OneToMany, JoinColumn } from 'typeorm';
import { Documento } from 'src/documentos/entities/documento.entity';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { PruebaEntregaEmbarque } from 'src/prueba_entrega_embarque/entities/prueba_entrega_embarque.entity';

@Entity('doc_cliente')

export class DocCliente
{
    @PrimaryGeneratedColumn({type:'smallint', unsigned:true})
    id!: number;

    @ManyToOne(() => Documento, { eager: true })
    @JoinColumn({ name: 'documento_id' })
    documento!: Documento;
    
    @ManyToOne(() => Cliente, { eager: true })
    @JoinColumn({ name: 'cliente_id' })
    cliente!: Cliente;

    @OneToMany(() => PruebaEntregaEmbarque, (prueba) => prueba.docCliente)
    pruebasEntrega!: PruebaEntregaEmbarque[];

}
