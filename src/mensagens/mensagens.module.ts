// src/mensagens/mensagens.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MensagensService } from './mensagens.service';
import { MensagensController } from './mensagens.controller';
import { Mensagem } from './entities/mensagem.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mensagem, Usuario])],
  controllers: [MensagensController],
  providers: [MensagensService],
})
export class MensagensModule {}
