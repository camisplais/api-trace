import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, OneToMany} from 'typeorm';
import { Viaje } from 'src/viajes/entities/viaje.entity';

export enum Estado
{
    VIAJE='viaje',
    PLANTA='planta',
}

@Entity('transportes')
export class Transporte
{
  @PrimaryGeneratedColumn({type:'smallint', unsigned:true})
  id!: number;

  @Column({ type: 'varchar', length:10})
  placas!: string;

  @Column({ type: 'varchar', length:30})
  marca!: string;

  @Column({ type: 'decimal', precision:10, scale:2 })
  carga_util!: string;

  @Column({ type: 'varchar', length:255, nullable:true})
  imagen?: string;

  @Column({ type: 'enum', enum:Estado, nullable:true})
    estado?: Estado;
  
  @OneToMany(() => Viaje, (viaje) => viaje.transporte)
  viajes!: Viaje[];
}
