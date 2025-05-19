import { Injectable, NotFoundException } from '@nestjs/common';
import { StatusDto } from './dto/status.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from './entities/status.entity';
import { Repository } from 'typeorm';
import { CreateStatusDto } from './dto/create-status.dto';
import { readFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
  ) {}

  create(createStatusDto: CreateStatusDto) {
    const newStatus = this.statusRepository.create(createStatusDto);
    return this.statusRepository.save(newStatus);
  }

  async findAll(): Promise<StatusDto[]> {
    const status = await this.statusRepository
      .createQueryBuilder('status')
      .select([
        'status.pontos',
        'status.id',
        'usuario.cidade',
        'usuario.apelido',
        'usuario.foto',
        'status.jogos',
        'status.vitorias',
      ])
      .leftJoin('status.usuario', 'usuario')
      .orderBy('status.pontos', 'DESC')
      .getMany();

    const statusComFotos = await Promise.all(
      status.map(async (status) => {
        let fotoBase64 = null;
        if (status.usuario.foto) {
          try {
            const nomeArquivo = status.usuario.foto.split('/').pop();

            const caminhoArquivo = join(
              __dirname,
              '..',
              '..',
              'storage',
              'fotos',
              nomeArquivo,
            );

            const arquivo = await readFile(caminhoArquivo);
            fotoBase64 = `data:image/png;base64,${arquivo.toString('base64')}`;
          } catch (error) {
            console.error('Erro ao ler foto:', error);
          }
        }

        return {
          id: status.id,
          usuario: status.usuario.apelido,
          cidade: status.usuario.cidade,
          foto: fotoBase64,
          pontos: status.pontos,
          jogos: status.jogos,
          vitorias: status.vitorias,
          derrotas: status.jogos - status.vitorias,
          percentual: +((status.vitorias / status.jogos) * 100).toFixed(2),
        };
      }),
    );

    return statusComFotos;
  }

  async getUserRankingPosition(
    userId: number,
  ): Promise<{ position: number; totalPlayers: number }> {
    // Busca todos os rankings ordenados por pontuação
    const rankings = await this.statusRepository
      .createQueryBuilder('status')
      .leftJoinAndSelect('status.usuario', 'usuario')
      .orderBy('status.pontos', 'DESC')
      .getMany();

    // Encontra a posição do usuário no ranking
    const position = rankings.findIndex((r) => r.usuario.id === userId) + 1;
    const totalPlayers = rankings.length;

    return { position, totalPlayers };
  }

  async findOne2(userId: number): Promise<Status> {
    const status = await this.statusRepository.findOne({
      where: { usuario: { id: userId } },
    });
    if (!status) {
      throw new NotFoundException(`Status for user ID ${userId} not found`);
    }
    return status;
  }

  async findOne(id: number): Promise<StatusDto> {
    const status = await this.statusRepository
      .createQueryBuilder('status')
      .select([
        'status.pontos',
        'status.id',
        'usuario.apelido',
        'status.jogos',
        'status.vitorias',
      ])
      .leftJoin('status.usuario', 'usuario')
      .where('status.id = :id', { id })
      .getOne();

    if (!status) {
      return null;
    }

    const data: StatusDto = {
      id: status.id,
      usuario: status.usuario.apelido,
      pontos: status.pontos,
      jogos: status.jogos,
      vitorias: status.vitorias,
    };

    return data;
  }

  async updatePontos(id: number, ponto: number): Promise<StatusDto> {
    const status = await this.statusRepository.findOne({
      where: { usuario: { id } },
    });

    if (!status) {
      return null;
    }

    if (status.pontos + ponto < 0) {
      status.pontos = 0;
    } else {
      status.pontos += ponto;
    }
    status.jogos += 1;
    if (ponto > 0) {
      status.vitorias += 1;
    }

    await this.statusRepository.save(status);
  }

  async remove(id: number): Promise<void> {
    await this.statusRepository.delete(id);
  }
}
