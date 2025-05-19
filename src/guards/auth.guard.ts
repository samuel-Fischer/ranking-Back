import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usuarioService: UsuariosService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    if (!authorization) {
      throw new UnauthorizedException('Token não fornecido');
    }

    try {
      const token = (authorization ?? '').split(' ')[1];
      const data = this.authService.checkToken(token);
      request.tokenPayload = data;

      const usuario = await this.usuarioService.findOne(data.id);
      if (!usuario) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      request.user = usuario;
      return true;
    } catch (error) {
      console.error('Erro ao verificar o token:', error);
      throw new UnauthorizedException('Token inválido');
    }
  }
}
