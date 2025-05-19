import { Type } from 'class-transformer';
import { IsNumber, ValidateNested } from 'class-validator';
import { CreateEquipeDto } from 'src/equipes/dto/create-equipe.dto';

export class CreatePartidaDto {
  @IsNumber()
  equipe1Id: number;

  @IsNumber()
  equipe2Id: number;

  @IsNumber()
  placarEquipe1: number;

  @IsNumber()
  placarEquipe2: number;
}

export class PartidaEquipeDTO {
    
    @ValidateNested()
    @Type(() => CreateEquipeDto)
    equipe1: CreateEquipeDto;

    @ValidateNested()
    @Type(() => CreateEquipeDto)
    equipe2: CreateEquipeDto;

    @IsNumber()
    placarEquipe1: number;

    @IsNumber()
    placarEquipe2: number;
}