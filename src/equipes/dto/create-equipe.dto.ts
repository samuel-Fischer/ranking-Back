import { IsNumber } from "class-validator";

export class CreateEquipeDto {
    @IsNumber()
    jogador1Id: number;
    
    @IsNumber()
    jogador2Id: number;
}
