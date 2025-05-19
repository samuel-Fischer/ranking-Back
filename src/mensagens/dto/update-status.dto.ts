// src/mensagens/dto/update-status.dto.ts
import { IsIn, IsString } from 'class-validator';

export class UpdateStatusDto {
  @IsString()
  @IsIn(['pendente', 'aceito', 'recusado'])
  status: string;
}
