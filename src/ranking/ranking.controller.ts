// esse  arquivo é o controller do ranking  
// ele é responsável por fazer a comunicação entre o cliente e o servidor
// ele é o arquivo que vai ser usado para fazer as requisições HTTP
// esse arquivo chama-se ranking.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { CreateRankingDto } from './dto/create-ranking.dto';
import { UpdateRankingDto } from './dto/update-ranking.dto';
import { RankingDto } from './dto/ranking.dto';

@Controller('ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Post()
  create(@Body() createRankingDto: CreateRankingDto) {
    return this.rankingService.create(createRankingDto);
  }

  @Get()
  findAll() {
    return this.rankingService.findAll();
  }

 


  @Get('pontuacao/range')
  getRankingByPontuacaoRange(
      @Query('min', ParseIntPipe) minPontuacao: number,
      @Query('max', ParseIntPipe) maxPontuacao: number,
  ) {
      return this.rankingService.getRankingByPontuacaoRange(minPontuacao, maxPontuacao);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<RankingDto> {
      return this.rankingService.findOne(id);
  }
  

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateRankingDto: UpdateRankingDto) {
    return this.rankingService.updatePontos(+id, updateRankingDto.pontuacao);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rankingService.remove(+id);
  }
}
