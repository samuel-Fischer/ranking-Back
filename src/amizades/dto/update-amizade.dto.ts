import { IsEnum } from 'class-validator';

export class UpdateAmizadeDto {
  @IsEnum(['aceito', 'recusado'])
  status: 'aceito' | 'recusado';
}