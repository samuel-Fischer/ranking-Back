import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Amizade } from './entities/amizade.entity';
import { CreateAmizadeDto } from './dto/create-amizade.dto';
import { UpdateAmizadeDto } from './dto/update-amizade.dto';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { join } from 'path';
import { readFile } from 'fs/promises';
import { Status } from 'src/status/entities/status.entity';

@Injectable()
export class AmizadesService {
  constructor(
    @InjectRepository(Amizade)
    private amizadesRepository: Repository<Amizade>,
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  async create(usuarioId: number, createAmizadeDto: CreateAmizadeDto) {
    console.log('amigo', createAmizadeDto.amigoId);
    console.log('usuario', usuarioId);
    // Verifica se o usuário existe
    const usuario = await this.usuariosRepository.findOne({
      where: { id: usuarioId },
    });
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verifica se o amigo existe
    const amigo = await this.usuariosRepository.findOne({
      where: { id: createAmizadeDto.amigoId },
    });
    if (!amigo) {
      throw new NotFoundException('Amigo não encontrado');
    }

    // Verifica se já existe uma amizade entre os usuários
    const amizadeExistente = await this.amizadesRepository.findOne({
      where: [
        { usuario: { id: usuarioId }, amigo: { id: createAmizadeDto.amigoId } },
        { usuario: { id: createAmizadeDto.amigoId }, amigo: { id: usuarioId } },
      ],
    });

    if (amizadeExistente) {
      throw new ConflictException('Solicitação de amizade já existe');
    }

    const amizade = this.amizadesRepository.create({
      usuario,
      amigo,
      status: 'pendente',
    });

    return this.amizadesRepository.save(amizade);
  }

  async countFriends(usuarioId: number): Promise<number> {
    return this.amizadesRepository.count({
      where: [
        { usuario: { id: usuarioId }, status: 'aceito' },
        { amigo: { id: usuarioId }, status: 'aceito' },
      ],
    });
  }

  async findAll(usuarioId: number) {
    return this.amizadesRepository
      .createQueryBuilder('amizade')
      .leftJoinAndSelect('amizade.usuario', 'usuario')
      .leftJoinAndSelect('amizade.amigo', 'amigo')
      .leftJoinAndSelect('usuario.status', 'statusUsuario')
      .leftJoinAndSelect('amigo.status', 'statusAmigo')
      .where('amizade.status = :status', { status: 'aceito' })
      
      .select([
        'amizade',
        'usuario.id',
        'usuario.nome',
        'usuario.foto',
        'amigo.id',
        'amigo.nome',
        'amigo.foto',
        'statusUsuario.pontos',
        'statusAmigo.pontos',
      ])
      .getMany();
  }
      
  async findPendentes(usuarioId: number) {
    const pendentes = await this.amizadesRepository.find({
      where: [{ amigo: { id: usuarioId }, status: 'pendente' }],
      relations: ['usuario', 'amigo'],
    });

    const pendentesComFotos = await Promise.all(
      pendentes.map(async (pendente) => {
        let fotoBase64 = null;
        if (pendente.usuario.foto) {
          try {
            const nomeArquivo = pendente.usuario.foto.split('/').pop();
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
          id: pendente.id,
          usuario: {
            id: pendente.usuario.id,
            nome: pendente.usuario.nome,
            foto: fotoBase64,
          },
          amigo: pendente.amigo,
          status: pendente.status,
        };
      }),
    );

    return pendentesComFotos;
  }

  async findAceitas(usuarioId: number) {
    return this.amizadesRepository.find({
      where: [
        { usuario: { id: usuarioId }, status: 'aceito' },
        { amigo: { id: usuarioId }, status: 'aceito' },
      ],
      relations: ['usuario', 'amigo'],
    });
  }

  async isAmizadeAceita(usuarioId: number, amigoId: number): Promise<boolean> {
    const amizade = await this.amizadesRepository.findOne({
      where: [
        {
          usuario: { id: usuarioId },
          amigo: { id: amigoId },
          status: 'aceito',
        },
        {
          usuario: { id: amigoId },
          amigo: { id: usuarioId },
          status: 'aceito',
        },
      ],
    });

    return !!amizade;
  }

  async update(
    id: number,
    usuarioId: number,
    updateAmizadeDto: UpdateAmizadeDto,
  ) {
    const amizade = await this.amizadesRepository.findOne({
      where: { id },
      relations: ['usuario', 'amigo'],
    });

    if (!amizade) {
      throw new NotFoundException('Solicitação de amizade não encontrada');
    }

    console.log('usuarioId:', usuarioId);
    console.log('amizade.amigo.id:', amizade.amigo.id);

    if (amizade.amigo.id == usuarioId) {
      amizade.status = updateAmizadeDto.status;
      return this.amizadesRepository.save(amizade);
    } else {
      throw new ConflictException(
        'Você não tem permissão para aceitar esta amizade',
      );
    }
  }

  async remove(id: number, usuarioId: number) {
    const amizade = await this.amizadesRepository.findOne({
      where: { id },
      relations: ['usuario', 'amigo'],
    });

    if (!amizade) {
      throw new NotFoundException('Amizade não encontrada');
    }

    if (amizade.usuario.id !== usuarioId && amizade.amigo.id !== usuarioId) {
      throw new ConflictException(
        'Você não tem permissão para remover esta amizade',
      );
    }

    await this.amizadesRepository.remove(amizade);
  }
}
