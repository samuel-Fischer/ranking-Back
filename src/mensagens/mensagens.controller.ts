// src/mensagens/mensagens.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { MensagensService } from './mensagens.service';
import { CreateMensagemDto } from './dto/create-mensagem.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('mensagens')
@UseGuards(AuthGuard('jwt'))
export class MensagensController {
  constructor(private readonly mensagensService: MensagensService) {}

  @Get('test-auth')
  testAuth(@Request() req) {
    if (!req.user) {
      throw new NotFoundException('Usuário não autenticado');
    }
    return req.user;
  }

  // Cria uma nova mensagem
  @Post()
  create(@Body() createMensagemDto: CreateMensagemDto) {
    return this.mensagensService.create(createMensagemDto);
  }

  // Retorna todas as mensagens de um usuário
  @Get()
  findByUsuarioId(@Request() req) {
    const usuarioId = req.user.id;
    if (isNaN(usuarioId)) {
      throw new BadRequestException('ID de usuário inválido');
    }
    return this.mensagensService.findByUsuarioId(usuarioId);
  }

  @Get('desafios')
  findDesafiosByUser(@Request() req) {
    return this.mensagensService.findDesafiosByUser(req.user.id);
  }

  // Retorna uma mensagem específica por ID
  @Get('mensagem/:id')
  findOne(@Param('id') id: string) {
    return this.mensagensService.findOne(Number(id));
  }

  // Atualiza o status de um desafio (aceitar ou recusar)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.mensagensService.updateStatus(Number(id), updateStatusDto);
  }

  // Remove uma mensagem por ID
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mensagensService.remove(Number(id));
  }
}
