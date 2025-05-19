import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AmizadesService } from './amizades.service';
import { CreateAmizadeDto } from './dto/create-amizade.dto';
import { UpdateAmizadeDto } from './dto/update-amizade.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('amizades')
@UseGuards(AuthGuard('jwt')) // Aplica o guard de autenticação JWT ao controlador
export class AmizadesController {
  constructor(private readonly amizadesService: AmizadesService) {}

  @Get('test-auth')
  testAuth(@Request() req) {
    if (!req.user) {
      throw new NotFoundException('Usuário não autenticado');
    }
    return req.user; // Deve retornar { id, nome, email } se autenticado corretamente
  }

  @Post()
  create(@Request() req, @Body() createAmizadeDto: CreateAmizadeDto) {
    return this.amizadesService.create(req.user.id, createAmizadeDto);
  }

 /*  @Get('count')
  async count(@Request() req): Promise<{ count: number }> {
    const usuarioId = req.user.id; 
    const count = await this.amizadesService.countFriends(usuarioId);
    return { count };
  } */

  @Get('count/:id') // Define que o ID será passado na URL
async count(@Param('id') id: string): Promise<{ count: number }> {
  const usuarioId = parseInt(id, 10); // Converte o ID para número
  if (isNaN(usuarioId)) {
    throw new BadRequestException('ID inválido');
  }

  const count = await this.amizadesService.countFriends(usuarioId);
  return { count };
}


  @Get()
  findAll(@Request() req) {
    return this.amizadesService.findAll(req.user.id);
  }

  @Get('pendentes')
  findPendentes(@Request() req) {
    return this.amizadesService.findPendentes(req.user.id);
  }

  @Get('status/:amigoId')
  async isAmizadeAceita(
    @Request() req,
    @Param('amigoId') amigoId: number,
  ): Promise<boolean> {
    const usuarioId = req.user.id; // Assumindo que o ID do usuário está no payload do token JWT
    return this.amizadesService.isAmizadeAceita(usuarioId, amigoId);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateAmizadeDto: UpdateAmizadeDto,
  ) {
    return this.amizadesService.update(+id, req.user.id, updateAmizadeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.amizadesService.remove(+id, req.user.id);
  }
}
