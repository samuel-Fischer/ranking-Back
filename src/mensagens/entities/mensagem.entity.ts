import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('mensagens')
export class Mensagem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, usuario => usuario.mensagensEnviadas)
  @JoinColumn({ name: 'remetenteId' })
  remetente: Usuario;

  @ManyToOne(() => Usuario, usuario => usuario.mensagensRecebidas)
  @JoinColumn({ name: 'destinatarioId' })
  destinatario: Usuario;

  @Column()
  mensagem: string;

  @Column()
  tipo: 'mensagem' | 'desafio';

  @Column({ default: 'pendente' })
  status: 'pendente' | 'aceito' | 'recusado';

  @CreateDateColumn()
  data: Date;
}