import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Status } from 'src/status/entities/status.entity';
import { Amizade } from 'src/amizades/entities/amizade.entity';
import { Mensagem } from 'src/mensagens/entities/mensagem.entity';
import { IsStrongPassword } from 'class-validator';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  nome: string;

  @Column({ nullable: true, default: 'perfil.png' })
  foto: string;

  @Column()
  apelido: string;

  @Column()
  email: string;

  @Column()
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  })
  senha: string;

  @Column()
  dataNascimento: Date;

  @Column({ nullable: true })
  telefone: string;

  @Column()
  cidade: string;

  @OneToOne(() => Status, (status) => status.usuario, { cascade: true })
  status: Status;

  @OneToMany(() => Amizade, (amizade) => amizade.usuario)
  amizades: Amizade[];

  @OneToMany(() => Amizade, (amizade) => amizade.amigo)
  amigos: Amizade[];

  @OneToMany(() => Amizade, (amizade) => amizade.usuario)
  amizadesEnviadas: Amizade[];

  @OneToMany(() => Amizade, (amizade) => amizade.amigo)
  amizadesRecebidas: Amizade[];

  @OneToMany(() => Mensagem, (mensagem) => mensagem.remetente)
  mensagensEnviadas: Mensagem[];

  @OneToMany(() => Mensagem, (mensagem) => mensagem.destinatario)
  mensagensRecebidas: Mensagem[];
}
