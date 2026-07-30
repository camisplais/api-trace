import { Entity, Column, PrimaryGeneratedColumn,OneToMany } from 'typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Entity('roles')

export class Role {
    
 @PrimaryGeneratedColumn({type:'tinyint', unsigned:true})
  id!: number;

  @Column({ type: 'varchar', length:20})
  nombre!: string;

  @OneToMany(() => Usuario, (usuario) => usuario.rol)
  usuarios!: Usuario[];
}
