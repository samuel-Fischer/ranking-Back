import { IsNumber } from 'class-validator';

export class CreateAmizadeDto {
  @IsNumber()
  amigoId: number;
}