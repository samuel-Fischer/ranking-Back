import { Injectable, NotFoundException } from '@nestjs/common';
import { PartidaEquipeDTO } from './dto/create-partida.dto';
import { UpdatePartidaDto } from './dto/update-partida.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Partida } from './entities/partida.entity';
import { Repository } from 'typeorm';
import { Equipe } from 'src/equipes/entities/equipe.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { PartidaDto } from './dto/partida.dto';
import { StatusService } from 'src/status/status.service';
import { RankingService } from 'src/ranking/ranking.service';
@Injectable()
export class PartidasService {
  constructor(
    @InjectRepository(Partida)
    private partidaRepository: Repository<Partida>,
    private statusService: StatusService,
    private rankingService: RankingService,
    @InjectRepository(Equipe)
    private equipeRepository: Repository<Equipe>,
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) { }

  async create(body: PartidaEquipeDTO) {
    console.log('Iniciando criação da partida', body);

    const jogador1Equipe1 = await this.usuarioRepository.findOne({
      where: { id: body.equipe1.jogador1Id },
    });
    const jogador2Equipe1 = await this.usuarioRepository.findOne({
      where: { id: body.equipe1.jogador2Id },
    });
    const jogador1Equipe2 = await this.usuarioRepository.findOne({
      where: { id: body.equipe2.jogador1Id },
    });
    const jogador2Equipe2 = await this.usuarioRepository.findOne({
      where: { id: body.equipe2.jogador2Id },
    });

    if (
      !jogador1Equipe1 ||
      !jogador2Equipe1 ||
      !jogador1Equipe2 ||
      !jogador2Equipe2
    ) {
      throw new NotFoundException('One or more players not found');
    }

    console.log('Jogadores encontrados: ', {
      jogador1Equipe1,
      jogador2Equipe1,
      jogador1Equipe2,
      jogador2Equipe2,
    });

    const statusA1 = await this.statusService.findOne2(body.equipe1.jogador1Id);
    const statusA2 = await this.statusService.findOne2(body.equipe1.jogador2Id);
    const statusB1 = await this.statusService.findOne2(body.equipe2.jogador1Id);
    const statusB2 = await this.statusService.findOne2(body.equipe2.jogador2Id);

    console.log('Status dos jogadores:', {
      statusA1,
      statusA2,
      statusB1,
      statusB2,
    });

    if (!statusA1) {
      throw new NotFoundException(
        `Status for jogador1Equipe1 (ID: ${body.equipe1.jogador1Id}) not found`,
      );
    }
    if (!statusA2) {
      throw new NotFoundException(
        `Status for jogador2Equipe1 (ID: ${body.equipe1.jogador2Id}) not found`,
      );
    }
    if (!statusB1) {
      throw new NotFoundException(
        `Status for jogador1Equipe2 (ID: ${body.equipe2.jogador1Id}) not found`,
      );
    }
    if (!statusB2) {
      throw new NotFoundException(
        `Status for jogador2Equipe2 (ID: ${body.equipe2.jogador2Id}) not found`,
      );
    }

    const equipe1 = this.equipeRepository.create({
      jogador1: jogador1Equipe1,
      jogador2: jogador2Equipe1,
    });
    const equipe2 = this.equipeRepository.create({
      jogador1: jogador1Equipe2,
      jogador2: jogador2Equipe2,
    });

    await this.equipeRepository.save([equipe1, equipe2]);

    const partida = this.partidaRepository.create({
      equipe1,
      equipe2,
      placarEquipe1: body.placarEquipe1,
      placarEquipe2: body.placarEquipe2,
      pontosA1: statusA1.pontos,
      pontosA2: statusA2.pontos,
      pontosB1: statusB1.pontos,
      pontosB2: statusB2.pontos,
    });

    await this.partidaRepository.save(partida);

    const mediaEquipe1 = (statusA1.pontos + statusA2.pontos) / 2;
    const mediaEquipe2 = (statusB1.pontos + statusB2.pontos) / 2;
    const diferenca = Math.abs(mediaEquipe1 - mediaEquipe2);

  

    let pontosGanhoMaior = 0;
    let pontosPerdidoMaior = 0;
    let pontosGanhoMenor = 0;
    let pontosPerdidoMenor = 0;

    if (diferenca < 500) {
      pontosGanhoMaior = 60;
      pontosPerdidoMaior = 50;
      pontosGanhoMenor = 70;
      pontosPerdidoMenor = 40;
    } else if (diferenca < 1000) {
      pontosGanhoMaior = 70;
      pontosPerdidoMaior = 60;
      pontosGanhoMenor = 80;
      pontosPerdidoMenor = 50;
    } else if (diferenca < 1500) {
      pontosGanhoMaior = 80;
      pontosPerdidoMaior = 70;
      pontosGanhoMenor = 90;
      pontosPerdidoMenor = 60;
    }
    console.log('Diferença de pontos:', diferenca);
    console.log(
      'Pontos ganhos pela equipe com maior pontuação:',
      pontosGanhoMaior,
    );
    console.log(
      'Pontos perdidos pela equipe com maior pontuação:',
      pontosPerdidoMaior,
    );
    console.log(
      'Pontos ganhos pela equipe com menor pontuação:',
      pontosGanhoMenor,
    );
    console.log(
      'Pontos perdidos pela equipe com menor pontuação:',
      pontosPerdidoMenor,
    );

    if (body.placarEquipe1 > body.placarEquipe2) {
      const diferencaPlacar = body.placarEquipe1 - body.placarEquipe2;
      const impactoPlacar = 1 + diferencaPlacar * 0.15; // Cada ponto de diferença adiciona 15% ao impacto
    
      const pontosGanhoMaiorComImpacto = Math.round(pontosGanhoMaior * impactoPlacar);
      const pontosPerdidoMenorComImpacto = Math.round(pontosPerdidoMenor * impactoPlacar);
    
      console.log('Impacto do placar:', impactoPlacar);
      console.log('Pontos ganhos com impacto:', pontosGanhoMaiorComImpacto);
      console.log('Pontos perdidos com impacto:', pontosPerdidoMenorComImpacto);
    
      await Promise.all([
        this.statusService.updatePontos(
          body.equipe1.jogador1Id,
          pontosGanhoMaiorComImpacto,
        ),
        this.statusService.updatePontos(
          body.equipe1.jogador2Id,
          pontosGanhoMaiorComImpacto,
        ),
        this.statusService.updatePontos(
          body.equipe2.jogador1Id,
          -pontosPerdidoMenorComImpacto,
        ),
        this.statusService.updatePontos(
          body.equipe2.jogador2Id,
          -pontosPerdidoMenorComImpacto,
        ),
      ]);

    } else if (body.placarEquipe1 < body.placarEquipe2) {
      const diferencaPlacar = body.placarEquipe2 - body.placarEquipe1;
      const impactoPlacar = 1 + diferencaPlacar * 0.15; // Cada ponto de diferença adiciona 15% ao impacto
    
      const pontosGanhoMenorComImpacto = Math.round(pontosGanhoMenor * impactoPlacar);
      const pontosPerdidoMaiorComImpacto = Math.round(pontosPerdidoMaior * impactoPlacar);
    
      console.log('Impacto do placar:', impactoPlacar);
      console.log('Pontos ganhos com impacto:', pontosGanhoMenorComImpacto);
      console.log('Pontos perdidos com impacto:', pontosPerdidoMaiorComImpacto);
    
      await Promise.all([
        this.statusService.updatePontos(
          body.equipe2.jogador1Id,
          pontosGanhoMenorComImpacto,
        ),
        this.statusService.updatePontos(
          body.equipe2.jogador2Id,
          pontosGanhoMenorComImpacto,
        ),
        this.statusService.updatePontos(
          body.equipe1.jogador1Id,
          -pontosPerdidoMaiorComImpacto,
        ),
        this.statusService.updatePontos(
          body.equipe1.jogador2Id,
          -pontosPerdidoMaiorComImpacto,
        ),
      ]);
    }
    
    

    await Promise.all([
      this.rankingService.updateRanking(body.equipe1.jogador1Id),
      this.rankingService.updateRanking(body.equipe1.jogador2Id),
      this.rankingService.updateRanking(body.equipe2.jogador1Id),
      this.rankingService.updateRanking(body.equipe2.jogador2Id),
    ]);

    console.log('Partida criada com sucesso:', partida);

    return partida;
  }


  findAll() {
    return `This action returns all partidas`;
  }

  async StatusfindAll(): Promise<PartidaDto[]> {
    const partidaQuery = await this.partidaRepository
      .createQueryBuilder('partida')
      .select([
        'partida.id',
        'partida.placarEquipe1',
        'partida.placarEquipe2',
        'equipe1.id',
        'equipe2.id',
        'jogador1_1.apelido',
        'jogador1_2.apelido',
        'jogador2_1.apelido',
        'jogador2_2.apelido',
        'partida.pontosA1',
        'partida.pontosA2',
        'partida.pontosB1',
        'partida.pontosB2',
        'partida.data',
      ])
      .leftJoin('partida.equipe1', 'equipe1')
      .leftJoin('equipe1.jogador1', 'jogador1_1')
      .leftJoin('equipe1.jogador2', 'jogador1_2')
      .leftJoin('partida.equipe2', 'equipe2')
      .leftJoin('equipe2.jogador1', 'jogador2_1')
      .leftJoin('equipe2.jogador2', 'jogador2_2')
      .orderBy('partida.placarEquipe1', 'DESC')
      .getMany();

    return partidaQuery.map((partida) => ({
      id: partida.id,
      usuario1E1: partida.equipe1.jogador1.apelido,
      usuario2E1: partida.equipe1.jogador2.apelido,
      usuario3E2: partida.equipe2.jogador1.apelido,
      usuario4E2: partida.equipe2.jogador2.apelido,
      PontosU1E1: partida.pontosA1,
      PontosU2E1: partida.pontosA2,
      PontosU3E2: partida.pontosB1,
      PontosU4E2: partida.pontosB2,
      data: partida.data,
      placarEquipe1: partida.placarEquipe1,
      placarEquipe2: partida.placarEquipe2,
    }));
  }

  
  async calcularEstatisticas(usuarioId: number, amigoId: number) {
    // Encontre equipes que contêm o usuário logado e o amigo
    const equipesUsuario = await this.equipeRepository
      .createQueryBuilder('equipe')
      .where('(equipe.jogador1Id = :usuarioId OR equipe.jogador2Id = :usuarioId)', { usuarioId })
      .getMany();
  
    const equipesAmigo = await this.equipeRepository
      .createQueryBuilder('equipe')
      .where('(equipe.jogador1Id = :amigoId OR equipe.jogador2Id = :amigoId)', { amigoId })
      .getMany();
  
    // IDs das equipes do usuário e do amigo
    const idsEquipesUsuario = equipesUsuario.map((equipe) => equipe.id);
    const idsEquipesAmigo = equipesAmigo.map((equipe) => equipe.id);
  
    // Jogos ao lado
    const aoLado = await this.partidaRepository
      .createQueryBuilder('partida')
      .leftJoinAndSelect('partida.equipe1', 'equipe1')
      .leftJoinAndSelect('partida.equipe2', 'equipe2')
      .where(
        '(equipe1.id IN (:...idsEquipesUsuario) AND equipe1.id IN (:...idsEquipesAmigo)) OR ' +
        '(equipe2.id IN (:...idsEquipesUsuario) AND equipe2.id IN (:...idsEquipesAmigo))',
        { idsEquipesUsuario, idsEquipesAmigo }
      )
      .getMany();
  
    // Jogos contra
    const contra = await this.partidaRepository
      .createQueryBuilder('partida')
      .leftJoinAndSelect('partida.equipe1', 'equipe1')
      .leftJoinAndSelect('partida.equipe2', 'equipe2')
      .where(
        '(equipe1.id IN (:...idsEquipesUsuario) AND equipe2.id IN (:...idsEquipesAmigo)) OR ' +
        '(equipe2.id IN (:...idsEquipesUsuario) AND equipe1.id IN (:...idsEquipesAmigo))',
        { idsEquipesUsuario, idsEquipesAmigo }
      )
      .getMany();
  
    // Função para calcular a taxa de vitórias
    const calcularTaxa = (vitorias: number, derrotas: number) => {
      const total = vitorias + derrotas;
      return total > 0 ? (vitorias / total) * 100 : 0;
    };
  
    // Função para verificar vitórias com tratamento de nulidade
    const verificarVitoria = (partida: Partida, idsEquipesUsuario: number[], ehVitoria: boolean) => {
      // Verifica se a equipe do usuário estava na equipe1 ou equipe2
      if (!partida.equipe1 || !partida.equipe2) {
        return false;
      }
  
      const equipesJogadorNaPartida = [
        idsEquipesUsuario.includes(partida.equipe1.id),
        idsEquipesUsuario.includes(partida.equipe2.id)
      ];
  
      if (equipesJogadorNaPartida[0]) {
        return ehVitoria ? partida.placarEquipe1 > partida.placarEquipe2 : partida.placarEquipe1 < partida.placarEquipe2;
      }
      if (equipesJogadorNaPartida[1]) {
        return ehVitoria ? partida.placarEquipe2 > partida.placarEquipe1 : partida.placarEquipe2 < partida.placarEquipe1;
      }
  
      return false;
    };
  
    // Calcular vitórias e derrotas ao lado
    const vitoriasAoLado = aoLado.filter((partida) => 
      verificarVitoria(partida, idsEquipesUsuario, true)
    ).length;
  
    const derrotasAoLado = aoLado.filter((partida) => 
      verificarVitoria(partida, idsEquipesUsuario, false)
    ).length;
  
    // Calcular vitórias e derrotas contra
    const vitoriasContra = contra.filter((partida) => 
      verificarVitoria(partida, idsEquipesUsuario, true)
    ).length;
  
    const derrotasContra = contra.filter((partida) => 
      verificarVitoria(partida, idsEquipesUsuario, false)
    ).length;
  
    return {
      aoLado: {
        jogos: aoLado.length,
        vitorias: vitoriasAoLado,
        derrotas: derrotasAoLado,
        taxaVitorias: calcularTaxa(vitoriasAoLado, derrotasAoLado),
      },
      contra: {
        jogos: contra.length,
        vitorias: vitoriasContra,
        derrotas: derrotasContra,
        taxaVitorias: calcularTaxa(vitoriasContra, derrotasContra),
      },
    };
  }
  
  
  
  

  async findPartidasByUserId(userId: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: userId },
    });
    if (!usuario) {
      throw new NotFoundException(`Usuario com ID "${userId}" não encontrado`);
    }

    const partidas = await this.partidaRepository
      .createQueryBuilder('partida')
      .select([
        'partida.id',
        'partida.placarEquipe1',
        'partida.placarEquipe2',
        'equipe1.id',
        'equipe2.id',
        'jogador1_1.id',
        'jogador1_1.nome',
        'jogador1_2.id',
        'jogador1_2.nome',
        'jogador2_1.id',
        'jogador2_1.nome',
        'jogador2_2.id',
        'jogador2_2.nome',
        'partida.data',
      ])
      .leftJoin('partida.equipe1', 'equipe1')
      .leftJoin('partida.equipe2', 'equipe2')
      .leftJoin('equipe1.jogador1', 'jogador1_1')
      .leftJoin('equipe1.jogador2', 'jogador1_2')
      .leftJoin('equipe2.jogador1', 'jogador2_1')
      .leftJoin('equipe2.jogador2', 'jogador2_2')
      .where(
        'jogador1_1.id = :userId OR jogador1_2.id = :userId OR jogador2_1.id = :userId OR jogador2_2.id = :userId',
        { userId },
      )
      .getMany();

    return partidas.map((partida) => {
      let parceiro, adversario1, adversario2, placarTime, placarAdversario;

      if (partida.equipe1.jogador1.id === userId) {
        parceiro = partida.equipe1.jogador2.nome;
        adversario1 = partida.equipe2.jogador1.nome;
        adversario2 = partida.equipe2.jogador2.nome;
        placarTime = partida.placarEquipe1;
        placarAdversario = partida.placarEquipe2;
      } else if (partida.equipe1.jogador2.id === userId) {
        parceiro = partida.equipe1.jogador1.nome;
        adversario1 = partida.equipe2.jogador1.nome;
        adversario2 = partida.equipe2.jogador2.nome;
        placarTime = partida.placarEquipe1;
        placarAdversario = partida.placarEquipe2;
      } else if (partida.equipe2.jogador1.id === userId) {
        parceiro = partida.equipe2.jogador2.nome;
        adversario1 = partida.equipe1.jogador1.nome;
        adversario2 = partida.equipe1.jogador2.nome;
        placarTime = partida.placarEquipe2;
        placarAdversario = partida.placarEquipe1;
      } else if (partida.equipe2.jogador2.id === userId) {
        parceiro = partida.equipe2.jogador1.nome;
        adversario1 = partida.equipe1.jogador1.nome;
        adversario2 = partida.equipe1.jogador2.nome;
        placarTime = partida.placarEquipe2;
        placarAdversario = partida.placarEquipe1;
      }
      return {
        id: partida.id,
        placarTime: placarTime,
        placarAdversario: placarAdversario,
        data: partida.data,
        parceiro: parceiro,
        adversario1: adversario1,
        adversario2: adversario2,
      };
    });
  }

  async findOne(id: number): Promise<PartidaDto> {
    const rankQuery = await this.partidaRepository
      .createQueryBuilder('ranking')
      .select(['ranking.pontuacao', 'ranking.id', 'usuario.apelido'])
      .leftJoin('ranking.usuario', 'usuario')
      .where('ranking.id = :id', { id })
      .getOne();

    if (!rankQuery) {
      throw new Error('Partida não encontrada');
    }

    const placarEquipe1 = rankQuery.placarEquipe1;
    const placarEquipe2 = rankQuery.placarEquipe2;

    const data: PartidaDto = {
      id: rankQuery.id,
      usuario1E1: rankQuery.equipe1.jogador1.apelido,
      usuario2E1: rankQuery.equipe1.jogador2.apelido,
      usuario3E2: rankQuery.equipe2.jogador1.apelido,
      usuario4E2: rankQuery.equipe2.jogador2.apelido,
      PontosU1E1: rankQuery.pontosA1,
      PontosU2E1: rankQuery.pontosA2,
      PontosU3E2: rankQuery.pontosB1,
      PontosU4E2: rankQuery.pontosB2,
      data: rankQuery.data,
      placarEquipe1,
      placarEquipe2,
    };

    return data;
  }

  update(id: number, updatePartidaDto: UpdatePartidaDto) {
    return `This action updates a #${id} partida`;
  }

  remove(id: number) {
    return `This action removes a #${id} partida`;
  }
}
