import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEquipeDto } from './dto/create-equipe.dto';
import { UpdateEquipeDto } from './dto/update-equipe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipe } from './entities/equipe.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Partida } from 'src/partidas/entities/partida.entity';

@Injectable()
export class EquipesService

{
  constructor(
    @InjectRepository(Equipe)
    private equipeRepository: Repository<Equipe>,
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Partida)
    private partidaRepository: Repository<Partida>,
  
  
  ){}
  async create(body: CreateEquipeDto) {
    console.log(body);
  
    const jogador1 = await this.usuarioRepository.findOne({ where: { id: body.jogador1Id } });
    const jogador2 = await this.usuarioRepository.findOne({ where: { id: body.jogador2Id } });
  
    if (!jogador1 || !jogador2) {
      throw new NotFoundException('Jogador não encontrado');
    }
  
    const equipe = this.equipeRepository.create({
      jogador1,
      jogador2,
    });
  
    return this.equipeRepository.save(equipe);
  }

  async findAll(usuarioId: number) {
    console.log('Usuário para busca de equipes:', usuarioId);
    if (!usuarioId) {
      throw new Error('Usuário não identificado');
    }
    return this.equipeRepository.find({
      where: [
        { jogador1: { id: usuarioId } },
        { jogador2: { id: usuarioId } },
      ],
      relations: ['jogador1', 'jogador2'],
    });
  }
  
  
  

  findOne(id: number) {
    return `This action returns a #${id} equipe`;
  }

  update(id: number, updateEquipeDto: UpdateEquipeDto) {
    return `This action updates a #${id} equipe`;
  }

  remove(id: number) {
    return `This action removes a #${id} equipe`;
  }
}
