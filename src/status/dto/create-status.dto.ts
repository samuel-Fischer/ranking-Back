import { IsInt, IsNumber } from 'class-validator';

export class CreateStatusDto {
  @IsInt()
  @IsNumber()
  usuarioId: number;


  @IsInt()
  @IsNumber()
  pontos: number;


  @IsInt()
  @IsNumber()
  jogos: number;

  @IsInt()
  @IsNumber()
  vitorias: number;
  

  
 
}
