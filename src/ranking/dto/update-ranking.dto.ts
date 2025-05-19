// esse arquivo é o DTO (Data Transfer Object) que vai ser usado para transferir dados entre o cliente e o servidor
// é uma forma de garantir que os dados que estão sendo enviados estão corretos e são válidos
// chama-se update-ranking.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateRankingDto } from './create-ranking.dto';

export class UpdateRankingDto extends PartialType(CreateRankingDto) {}
