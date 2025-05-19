import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Ranking } from 'src/ranking/entities/ranking.entity';
import { UsuarioRankingDto } from './dto/usuario-ranking.dto';
import { Like } from 'typeorm';
import { Status } from 'src/status/entities/status.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly repository: Repository<Usuario>,
    @InjectRepository(Ranking)
    private readonly rankingRepository: Repository<Ranking>,
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
  ) {}

  async create(dto: CreateUsuarioDto) {
    const salt = bcrypt.genSaltSync(10);
    dto.senha = await bcrypt.hash(dto.senha, salt);
    const usuario = this.repository.create(dto);
    await this.repository.save(usuario);
    const status = this.statusRepository.create({ usuario });
    return this.statusRepository.save(status);
  }

  async findAll(): Promise<UsuarioRankingDto[]> {
    const rankQuery = await this.rankingRepository
      .createQueryBuilder('ranking')
      .select(['ranking.pontuacao', 'ranking.id', 'usuario.apelido'])
      .leftJoin('ranking.usuario', 'usuario')
      .orderBy('ranking.pontuacao', 'DESC')
      .getMany();

    return rankQuery
      .map((rank, index) => ({
        id: rank.id,
        apelido: rank.usuario.apelido,
        pontuacao: rank.pontuacao,

        posicaoRanking: index + 1, // Adiciona a posição com base na ordenação
      }))
      .filter((rank) => rank.id && !isNaN(rank.posicaoRanking)); // Filtra rankings com posição NaN
  }

  async findByEmail(email: string) {
    return this.repository.findOne({ where: { email } });
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: number, dto: UpdateUsuarioDto) {
    const usuario = await this.repository.findOne({ where: { id } });
    if (!usuario) {
      throw new Error('Usuario not found');
    }
    this.repository.merge(usuario, dto);
    const salt = bcrypt.genSaltSync(10);
    dto.senha = await bcrypt.hash(dto.senha, salt);
    return this.repository.save(usuario);
  }

  async rankingByUserId(id: number): Promise<UsuarioRankingDto> {
    const usuario = await this.repository.findOne({ where: { id } });
    if (!usuario) {
      throw new Error('Usuario not found');
    }
    const ranking = await this.rankingRepository.findOne({
      where: { usuario },
    });
    if (!ranking) {
      throw new Error('Ranking not found');
    }

    // Obter todos os rankings ordenados por pontuação de forma decrescente
    const allRankings = await this.rankingRepository.find({
      order: {
        pontuacao: 'DESC',
      },
    });

    // Encontrar a posição do usuário
    let posicaoRanking = 1;
    for (let i = 0; i < allRankings.length; i++) {
      if (allRankings[i].id === ranking.id) {
        posicaoRanking = i + 1;
        break;
      }
      // Se houver empate, não incrementa a posição
      if (i > 0 && allRankings[i].pontuacao !== allRankings[i - 1].pontuacao) {
        posicaoRanking++;
      }
    }

    // Construir o DTO com a posição do ranking
    const data: UsuarioRankingDto = {
      id: usuario.id,
      apelido: usuario.apelido,
      pontuacao: ranking.pontuacao,
    };

    return data;
  }

  async updateUserPhoto(id: number, photoUrl: string): Promise<Usuario> {
    const usuario = await this.repository.findOne({ where: { id } });
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    usuario.foto = photoUrl;
    return this.repository.save(usuario);
  }

  async remove(id: number) {
    const usuario = await this.repository.findOne({ where: { id } });
    if (!usuario) {
      throw new Error('Usuario not found');
    }
    return this.repository.remove(usuario);
  }

  async rankingForAllUsers(): Promise<UsuarioRankingDto[]> {
    // Buscar todos os usuários
    const usuarios = await this.repository.find();
    if (!usuarios.length) {
      throw new Error('Nenhum usuário encontrado');
    }

    console.log('Usuários encontrados:', usuarios);

    // Obter todos os rankings ordenados por pontuação de forma decrescente
    const allRankings = await this.rankingRepository.find({
      order: {
        pontuacao: 'DESC',
      },
      relations: ['usuario'], // Certifique-se de buscar as relações necessárias
    });

    console.log('Rankings encontrados:', allRankings);

    // Criar um mapa de rankings para facilitar a busca
    const rankingMap = new Map<number, any>();
    allRankings.forEach((ranking, index) => {
      rankingMap.set(ranking.usuario.id, {
        ...ranking,
        posicao: index + 1,
      });
    });

    console.log('Mapa de rankings:', rankingMap);

    // Montar o array de DTOs com as informações de cada usuário

    const usuariosRankingDto: UsuarioRankingDto[] = usuarios.map((usuario) => {
      const ranking = rankingMap.get(usuario.id);
      if (!ranking) {
        throw new Error(
          `Ranking não encontrado para o usuário com ID ${usuario.id}`,
        );
      }

      // Verificar se a pontuação e a posição são válidas
      if (!ranking || isNaN(ranking.pontuacao) || isNaN(ranking.posicao)) {
        throw new Error(
          `Dados inválidos para o usuário com ID ${usuario.id}: pontuacao=${ranking.pontuacao}, posicao=${ranking.posicao}`,
        );
      }

      return {
        id: usuario.id,
        apelido: usuario.apelido,
        pontuacao: ranking.pontuacao,
        categoria: ranking.categoria,
        numeroDerrotas: 0, // Preencher esses dados conforme necessário
        numeroVitorias: 0,
        posicaoRanking: ranking.posicao,
      };
    });

    console.log('Usuários com rankings:', usuariosRankingDto);

    return usuariosRankingDto;
  }

  async findOneByNomeOrApelido(nomeOuApelido: string) {
    const nomeOuApelidoLowerCase = nomeOuApelido.toLowerCase();
    return this.repository
      .createQueryBuilder('usuario')
      .select(['usuario.nome', 'usuario.id', 'usuario.foto'])
      .where('LOWER(usuario.nome) LIKE :nome', {
        nome: `%${nomeOuApelidoLowerCase}%`,
      })
      .orWhere('LOWER(usuario.apelido) LIKE :apelido', {
        apelido: `%${nomeOuApelidoLowerCase}%`,
      })
      .getMany();
  }
}
