import { CreateUsuarioDto } from 'src/usuarios/dto/create-usuario.dto';

export class AuthRegisterDto extends CreateUsuarioDto {
  senha: string;
}
