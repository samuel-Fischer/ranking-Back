import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request, UseGuards } from '@nestjs/common';
import { PartidasService } from './partidas.service';
import { CreatePartidaDto, PartidaEquipeDTO } from './dto/create-partida.dto';
import { UpdatePartidaDto } from './dto/update-partida.dto';
import { AuthGuard } from '@nestjs/passport';



@Controller('partidas')
export class PartidasController {
  constructor(private readonly partidasService: PartidasService) {}

  @Post()
  create(@Body() createPartidaDto: PartidaEquipeDTO) {
    return this.partidasService.create(createPartidaDto);
  }
  @Get()
  findAll() {
    return this.partidasService.findAll();
  }

  @Get('estatisticas/:amigoId')
  @UseGuards(AuthGuard ('jwt'))
  async getEstatisticas(
    @Param('amigoId') amigoId: number,
    @Request() req,
  ) {
    const usuarioId = req.user?.id; // Pegue o ID do usuário logado
    if (!usuarioId) {
      throw new Error('Usuário não autenticado');
    }
    console.log('Usuário autenticado:', usuarioId);
    return this.partidasService.calcularEstatisticas(usuarioId, amigoId);
  }


  @Get('stats')
  StatusfindAll() {
    return this.partidasService.StatusfindAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partidasService.findOne(+id);
  }
  // criar um buca de partidas pelo id do usuario
  @Get('usuario/:id')
  findPartidasByUserId(@Param('id') id: string) {
    return this.partidasService.findPartidasByUserId(+id);
  }
  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePartidaDto: UpdatePartidaDto) {
    return this.partidasService.update(+id, updatePartidaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partidasService.remove(+id);
  }


}
