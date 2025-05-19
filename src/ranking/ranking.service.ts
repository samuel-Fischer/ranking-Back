import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Ranking } from './entities/ranking.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Status } from 'src/status/entities/status.entity';
import { RankingDto } from './dto/ranking.dto';
import { CreateRankingDto } from './dto/create-ranking.dto';

@Injectable()
export class RankingService {
  constructor(
    @InjectRepository(Ranking)
    private rankingRepository: Repository<Ranking>,
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Status)
    private statusRepository: Repository<Status>,
  ) {}

  async create(createRankingDto: CreateRankingDto): Promise<Ranking> {
    const user = await this.usuarioRepository.findOne({
      where: { id: createRankingDto.usuarioId },
    });
    if (!user) {
      throw new NotFoundException(
        `User with ID ${createRankingDto.usuarioId} not found`,
      );
    }

    const ranking = this.rankingRepository.create({
      usuario: user,
      pontuacao: createRankingDto.pontuacao,
    });

    return this.rankingRepository.save(ranking);
  }

  async updateRanking(userId: number): Promise<void> {
    const user = await this.usuarioRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const status = await this.statusRepository.findOne({
      where: { usuario: { id: userId } },
    });
    if (!status) {
      throw new NotFoundException(`Status for user ID ${userId} not found`);
    }

    let ranking = await this.rankingRepository.findOne({
      where: { usuario: { id: userId } },
    });
    if (!ranking) {
      ranking = this.rankingRepository.create({
        usuario: user,
        pontuacao: status.pontos,
      });
    } else {
      ranking.pontuacao = status.pontos;
    }

    await this.rankingRepository.save(ranking);
  }

  // ranking por pontuação buscar etre dois parametros	0 - 1000, 1000 - 2000, 2000 - 3000, 3000 - 4000, 4000 - 5000

  async getRankingByPontuacaoRange(
    minPontuacao: number,
    maxPontuacao: number,
  ): Promise<Ranking[]> {
    if (isNaN(minPontuacao) || isNaN(maxPontuacao)) {
      throw new Error('Valores inválidos para minPontuacao ou maxPontuacao');
  }
    return this.rankingRepository.find({
      where: {
        pontuacao: Between(minPontuacao, maxPontuacao),
      },
      order: {
        pontuacao: 'DESC',
      },
      relations: ['usuario'],
    });
  }

  async findAll(): Promise<Ranking[]> {
    return this.rankingRepository.find({
      order: {
        pontuacao: 'DESC',
      },
      relations: ['usuario'],
    });
  }

  async getRanking(): Promise<Ranking[]> {
    return this.rankingRepository.find({
      order: {
        pontuacao: 'DESC',
      },
      relations: ['usuario'],
    });
  }

  async remove(id: number): Promise<void> {
    const result = await this.rankingRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Ranking with ID ${id} not found`);
    }
  }

  async findOne(id: number): Promise<RankingDto> {
    const ranking = await this.rankingRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });
    if (!ranking) {
      throw new NotFoundException(`Ranking with ID ${id} not found`);
    }

    return {
      id: ranking.id,
      usuarioId: ranking.usuario.id,
      pontuacao: ranking.pontuacao,
    };
  }

  async updatePontos(userId: number, pontos: number): Promise<void> {
    const ranking = await this.rankingRepository.findOne({
      where: { usuario: { id: userId } },
    });
    if (!ranking) {
      throw new NotFoundException(`Ranking for user ID ${userId} not found`);
    }
    ranking.pontuacao = pontos;
    if (isNaN(pontos)) {
      throw new Error('Pontos inválidos');
  }
  

    await this.rankingRepository.save(ranking);
  }
}
