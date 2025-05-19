import { Usuario } from 'src/usuarios/entities/usuario.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('status')
export class Status {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Usuario)
  @JoinColumn()
  usuario: Usuario;

  @Column({ type: 'int', default: 0 })
  pontos: number;

  @Column({ type: 'int', default: 0 })
  jogos: number;

  @Column({ type: 'int', default: 0 })
  vitorias: number;
}
