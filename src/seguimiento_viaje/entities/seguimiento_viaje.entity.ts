import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne,OneToOne,OneToMany,JoinColumn } from 'typeorm';
import { Viaje } from 'src/viajes/entities/viaje.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';

@Entity('seguimiento_viaje')

export class SeguimientoViaje
{
    @PrimaryGeneratedColumn({type:'int', unsigned:true})
    id!: number;

    @OneToOne(() => Viaje, { eager: true })
    @JoinColumn({ name: 'viaje_id' })
    viaje!: Viaje;

    @Column({ type: 'datetime', nullable:true})
    entrada?: Date;

    @Column({ type: 'datetime', nullable:true})
    salida?: Date;
        
    @ManyToOne(() => Empleado, { eager: true })
    @JoinColumn({ name: 'empleado_caseta_entrada_id' })
    empleado_caseta_entrada!: Empleado;

    @ManyToOne(() => Empleado, { eager: true })
    @JoinColumn({ name: 'empleado_caseta_salida_id' })
    empleado_caseta_salida!: Empleado;
    
    @ManyToOne(() => Empleado, { eager: true })
    @JoinColumn({ name: 'empleado_qr_salida_id' })
    empleado_qr_salida!: Empleado;

    @Column({ type: 'varchar', length:255})
    qr!: string;

    @CreateDateColumn()
    createdAt!: Date;
    
    @UpdateDateColumn()
    updatedAt!: Date;
    
    @DeleteDateColumn()
    deletedAt?: Date;
}

