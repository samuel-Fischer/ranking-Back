import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('amizades')
export class Amizade {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, usuario => usuario.amizadesEnviadas)
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;

  @ManyToOne(() => Usuario, usuario => usuario.amizadesRecebidas)
  @JoinColumn({ name: 'amigoId' })
  amigo: Usuario;

  @Column({ default: 'pendente' })
  status: 'pendente' | 'aceito' | 'recusado';

  @CreateDateColumn()
  dataSolicitacao: Date;
}