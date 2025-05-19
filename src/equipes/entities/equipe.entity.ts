import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Equipe {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Usuario, usuario => usuario.id)
    jogador1: Usuario;

    @ManyToOne(() => Usuario, usuario => usuario.id)
    jogador2: Usuario;

}
