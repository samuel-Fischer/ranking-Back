import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsDateString,
} from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsOptional()
  foto: string;

  @IsString()
  @IsNotEmpty()
  apelido: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  senha: string;

  @IsDateString()
  @IsNotEmpty()
  dataNascimento: Date;

  @IsPhoneNumber()
  @IsOptional()
  telefone: string;

  @IsString()
  @IsNotEmpty()
  cidade: string;
}
