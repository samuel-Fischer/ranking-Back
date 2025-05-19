
// Esse é o arquivo que vai ser usado para validar os dados que vão ser enviados para o banco de dados
// esse arquivo chama-se ranking.entity.ts

import { Usuario } from 'src/usuarios/entities/usuario.entity';
import {  Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';




@Entity('ranking')
export class Ranking {
  @PrimaryGeneratedColumn()
  id: number;

 @ManyToOne(() => Usuario)
  usuario: Usuario;

 @Column({type: 'int', default: 0})
 pontuacao: number;
 }