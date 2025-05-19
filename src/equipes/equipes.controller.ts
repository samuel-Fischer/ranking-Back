import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request, UseGuards, UnauthorizedException } from '@nestjs/common';
import { EquipesService } from './equipes.service';
import { CreateEquipeDto } from './dto/create-equipe.dto';
import { UpdateEquipeDto } from './dto/update-equipe.dto';
import { AuthGuard } from '@nestjs/passport';



  


@UseGuards(AuthGuard ('jwt'))
@Controller('equipes')
export class EquipesController {
  constructor(
    private readonly equipesService: EquipesService,
  ) {}
  @Post()
  create(@Body() createEquipeDto: CreateEquipeDto) {
    return this.equipesService.create(createEquipeDto);
  }
 
  @Get()
  findAll(@Request() req) {
    console.log('Usuário autenticado no req.user:', req.user); // Log para depuração
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('Usuário não autenticado');
    }
    return this.equipesService.findAll(req.user.id);
  }
  

  

  

  @Get(':id')
  findOne(@Param('id') id: string) {
    const equipeId = parseInt(id, 10);
    if (isNaN(equipeId)) {
      throw new Error('Invalid ID format');
    }
    return this.equipesService.findOne(equipeId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEquipeDto: UpdateEquipeDto) {
    const equipeId = parseInt(id, 10);
    if (isNaN(equipeId)) {
      throw new Error('Invalid ID format');
    }
    return this.equipesService.update(equipeId, updateEquipeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const equipeId = parseInt(id, 10);
    if (isNaN(equipeId)) {
      throw new Error('Invalid ID format');
    }
    return this.equipesService.remove(equipeId);
  }
}
