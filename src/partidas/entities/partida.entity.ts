import { Equipe } from "src/equipes/entities/equipe.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Partida {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Equipe, equipe => equipe.id)
    equipe1: Equipe;

    @ManyToOne(() => Equipe, equipe => equipe.id)
    equipe2: Equipe;

    @Column()
    placarEquipe1: number;

    @Column()
    placarEquipe2: number;


    @Column( {default: new Date()})
    data: Date;
    @Column( {default: 0})
    pontosA1: number;

    @Column( {default: 0})
    pontosA2: number;

    @Column( {default: 0})
    pontosB1: number;

    @Column( {default: 0})
    pontosB2: number;


}
