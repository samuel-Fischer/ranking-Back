import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmizadesService } from './amizades.service';
import { AmizadesController } from './amizades.controller';
import { Amizade } from './entities/amizade.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Amizade, Usuario])],
  controllers: [AmizadesController],
  providers: [AmizadesService],
})
export class AmizadesModule {}