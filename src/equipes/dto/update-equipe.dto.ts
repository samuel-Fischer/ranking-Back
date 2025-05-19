import { PartialType } from '@nestjs/mapped-types';
import { CreateEquipeDto } from './create-equipe.dto';

export class UpdateEquipeDto extends PartialType(CreateEquipeDto) {}
