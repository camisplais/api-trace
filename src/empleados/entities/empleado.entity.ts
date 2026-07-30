import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne, OneToMany } from 'typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Embarque } from 'src/embarques/entities/embarque.entity';
import { Viaje } from 'src/viajes/entities/viaje.entity';
import { SeguimientoViaje } from 'src/seguimiento_viaje/entities/seguimiento_viaje.entity';
import { Solicitude } from 'src/solicitudes/entities/solicitude.entity';

export enum Departamento
{
    SUPPLYCHAIN='supplychain',
    TRANSPORTES='transportes',
    SEGURIDAD='seguridad'
}

export enum Estado
{
    DISPONIBLE='disponible',
    OCUPADO='ocupado',
}

@Entity('empleados')

export class Empleado
{
  @PrimaryGeneratedColumn({type:'mediumint', unsigned:true})
  id!: number;

  @Column({ type: 'mediumint', unsigned:true})
  no_empleado!: number;

  @Column({ type: 'varchar', length:36})
  nombre!: string;

  @Column({ type: 'varchar', length:21})
  apellido_paterno!: string;

  @Column({ type: 'varchar', length:21, nullable:true})
  apellido_materno?: string;

  @Column({ type: 'date'})
  fecha_nacimiento!: Date;

  @Column({ type: 'date'})
  fecha_ingreso!: Date;

  @Column({ type: 'varchar', length:255, nullable:true})
  imagen?: string;

  @Column({ type: 'enum', enum:Departamento})
  departamento!: Departamento;

  @Column({ type: 'varchar', length:34})
  puesto!: string;

  @Column({ type: 'enum', enum:Estado, nullable:true})
  estado?: Estado;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToOne(() => Usuario, (usuario) => usuario.empleado)
  usuario!: Usuario;

  @OneToMany(() => Embarque, (embarque) => embarque.empleado)
  embarques!: Embarque[];

  @OneToMany(() => Viaje, (viaje) => viaje.empleado_chofer)
  viajes_empleado_chofer!: Viaje[];

  @OneToMany(() => Viaje, (viaje) => viaje.empleado_embarque)
  viajes_empleado_embarque!: Viaje[]

  @OneToMany(() => SeguimientoViaje, (s) => s.empleado_caseta_entrada)
  seguimientosCasetaEntrada!: SeguimientoViaje[];

  @OneToMany(() => SeguimientoViaje, (s) => s.empleado_caseta_salida)
  seguimientosCasetaSalida!: SeguimientoViaje[];

  @OneToMany(() => SeguimientoViaje, (s) => s.empleado_qr_salida)
  seguimientosQrSalida!: SeguimientoViaje[]

  @OneToMany(() => Solicitude, (s) => s.empleado_emisor)
  solicitudesEnviadas!: Solicitude[];

  @OneToMany(() => Solicitude, (s) => s.empleado_receptor)
  solicitudesRecibidas!: Solicitude[];


}
