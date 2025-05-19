import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { join } from 'path';
import { readFile } from 'fs/promises';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const usuario = await this.usuariosService.findOne(id);
    if (!usuario) {
      throw new Error('Usuario not found');
    }
    return usuario;
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    const usuario = await this.usuariosService.findByEmail(email);
    if (!usuario) {
      throw new Error('Usuario not found');
    }
    return usuario;
  }

  // @Get('apelido/:apelido')
  // @Patch(':id')
  // async update(
  //   @Param('id') id: number,
  //   @Body() updateUsuarioDto: UpdateUsuarioDto,
  // ) {
  //   const usuario = await this.usuariosService.update(id, updateUsuarioDto);
  //   if (!usuario) {
  //     throw new Error('Usuario not found');
  //   }
  //   return usuario;
  // }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: number) {
    const usuario = await this.usuariosService.remove(id);
    if (!usuario) {
      throw new Error('Usuario not found');
    }
  }

  @Get('ranking/:id')
  async rankingByUserId(@Param('id') id: number) {
    return this.usuariosService.rankingByUserId(id);
  }

  // @Get('rankings')
  // async getRankings(): Promise<UsuarioRankingDto[]> {
  //   console.log('Obtendo rankings para todos os usuários');
  //   const rankings = await this.usuariosService.rankingForAllUsers();
  //   console.log('Rankings obtidos:', rankings);
  //   return rankings;
  // }

  @Get('foto/:filename')
  async getFoto(@Param('filename') filename: string, @Res() res: Response) {
    try {
      const caminhoArquivo = join(
        __dirname,
        '..',
        '..',
        'storage',
        'fotos',
        filename,
      );

      const arquivo = await readFile(caminhoArquivo);

      res.setHeader('Content-Type', 'image/png');
      res.contentType('image/png');

      res.send(arquivo);
    } catch (error) {
      res.status(404).send('Imagem não encontrada');
    }
  }

  @Get('nomeOuApelido/:nomeOuApelido')
  async findOneByNomeOrApelido(@Param('nomeOuApelido') nomeOuApelido: string) {
    const usuario =
      await this.usuariosService.findOneByNomeOrApelido(nomeOuApelido);
    if (!usuario) {
      throw new Error('Usuario not found');
    }
    return usuario;
  }
}
