import { forwardRef,Module } from '@nestjs/common';
import { EquipesService } from './equipes.service';
import { EquipesController } from './equipes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipe } from './entities/equipe.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { PartidasModule } from '../partidas/partidas.module';

@Module({
  imports: [TypeOrmModule.forFeature([Equipe, Usuario,]), forwardRef(() => PartidasModule)],
  controllers: [EquipesController],
  providers: [EquipesService],
  exports: [EquipesService],
})
export class EquipesModule {}
