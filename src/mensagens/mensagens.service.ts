// src/mensagens/mensagens.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMensagemDto } from './dto/create-mensagem.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Mensagem } from './entities/mensagem.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { join } from 'path';
import { readFile } from 'fs/promises';

@Injectable()
export class MensagensService {
  constructor(
    @InjectRepository(Mensagem)
    private readonly mensagemRepository: Repository<Mensagem>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  // Cria uma nova mensagem
  async create(createMensagemDto: CreateMensagemDto): Promise<Mensagem> {
    const { remetenteId, destinatarioId, mensagem, tipo } = createMensagemDto;

    const remetente = await this.usuarioRepository.findOne({
      where: { id: remetenteId },
    });
    const destinatario = await this.usuarioRepository.findOne({
      where: { id: destinatarioId },
    });

    if (!remetente || !destinatario) {
      throw new NotFoundException('Remetente ou destinatário não encontrado');
    }

    // Usando `Partial` para permitir a criação sem todas as propriedades obrigatórias
    const novaMensagem = this.mensagemRepository.create({
      remetente,
      destinatario,
      mensagem,
      tipo: tipo as 'comum' | 'desafio', // Casting explícito
      status: 'pendente' as 'pendente' | 'aceito' | 'recusado', // Casting explícito
    } as Partial<Mensagem>);

    return this.mensagemRepository.save(novaMensagem);
  }

  // Retorna todas as mensagens de um usuário específico (enviadas e recebidas)
  async findByUsuarioId(usuarioId: number): Promise<Mensagem[]> {
    return this.mensagemRepository.find({
      where: [
        { remetente: { id: usuarioId } },
        { destinatario: { id: usuarioId } },
      ],
      relations: ['remetente', 'destinatario'],
      order: { data: 'DESC' },
    });
  }

  // Retorna todos os desafios que um usuario recebeu
  async findDesafiosByUser(usuarioId: number) {
    const desafios = await this.mensagemRepository.find({
      where: [{ destinatario: { id: usuarioId }, tipo: 'desafio' }],
      relations: ['remetente', 'destinatario'],
    });

    const desafiosComFotos = await Promise.all(
      desafios.map(async (desafio) => {
        let fotoBase64 = null;
        if (desafio.remetente.foto) {
          try {
            const nomeArquivo = desafio.remetente.foto.split('/').pop();
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
          id: desafio.id,
          mensagem: desafio.mensagem,
          tipo: desafio.tipo,
          status: desafio.status,
          data: desafio.data,
          remetente: {
            id: desafio.remetente.id,
            nome: desafio.remetente.nome,
            foto: fotoBase64,
          },
        };
      }),
    );

    return desafiosComFotos;
  }

  // Retorna uma mensagem específica pelo ID
  async findOne(id: number): Promise<Mensagem> {
    const mensagem = await this.mensagemRepository.findOne({
      where: { id },
      relations: ['remetente', 'destinatario'],
    });

    if (!mensagem) {
      throw new NotFoundException(`Mensagem com ID ${id} não encontrada`);
    }

    return mensagem;
  }

  // Atualiza o status de uma mensagem do tipo "desafio"
  async updateStatus(
    id: number,
    updateStatusDto: UpdateStatusDto,
  ): Promise<Mensagem> {
    const mensagem = await this.findOne(id);

    if (mensagem.tipo !== 'desafio') {
      throw new NotFoundException(`A mensagem com ID ${id} não é um desafio`);
    }

    mensagem.status = updateStatusDto.status as
      | 'pendente'
      | 'aceito'
      | 'recusado';
    return this.mensagemRepository.save(mensagem);
  }

  // Remove uma mensagem específica pelo ID
  async remove(id: number): Promise<void> {
    const mensagem = await this.findOne(id);
    await this.mensagemRepository.remove(mensagem);
  }
}
