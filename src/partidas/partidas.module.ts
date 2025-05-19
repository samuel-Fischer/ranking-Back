import { Module } from '@nestjs/common';
import { PartidasService } from './partidas.service';
import { PartidasController } from './partidas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipe } from 'src/equipes/entities/equipe.entity';
import { Partida } from './entities/partida.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { EquipesModule } from 'src/equipes/equipes.module';
import { RankingModule } from 'src/ranking/ranking.module';

import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { Status } from 'src/status/entities/status.entity';
import { StatusModule } from 'src/status/status.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Equipe, Partida, Usuario, Status]),
    RankingModule, // Importe RankingModule para usar RankingService e RankingRepository
    UsuariosModule, // Importe UsuariosModule se necessário para este módulo
    StatusModule, // Importe StatusModule se necessário para este módulo
    EquipesModule, // Importe EquipesModule para usar EquipesService e EquipesRepository
  ],
  controllers: [PartidasController],
  providers: [PartidasService],
  exports: [TypeOrmModule],
  
})
export class PartidasModule {}