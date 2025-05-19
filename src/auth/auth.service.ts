import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  private issuer = 'login';
  private audience = 'usuarios';

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private readonly milerService: MailerService,
  ) {}

  createToken(user: Usuario) {
    const token = this.jwtService.sign(
      {
        id: user.id,
        nome: user.nome,
        email: user.email,
      },
      {
        expiresIn: '1d',
        subject: String(user.id),
        issuer: this.issuer,
        audience: this.audience,
      },
    );
    return { accessToken: token };
  }

  checkToken(token: string) {
    try {
      const data = this.jwtService.verify(token, {
        issuer: this.issuer,
        audience: this.audience,
      });
      return data;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async login(email: string, senha: string) {
    try {
      const user = await this.usuarioRepository.findOne({ where: { email } });

      if (!user) {
        console.error('Usuário não encontrado');
        throw new UnauthorizedException('Credenciais inválidas');
      }

      console.log('Usuário encontrado:', user);

      console.log('Senha Digitada:', senha);
      console.log('Senha do Usuário:', user.senha);

      const isPasswordValid = await bcrypt.compare(senha, user.senha);
      console.log('Senha Digitada:', senha);
      console.log('Senha do Usuário:', user.senha);
      if (!isPasswordValid) {
        console.error('Senha inválida');
        throw new UnauthorizedException('Credenciais inválidas');
      }

      console.log('Senha válida, gerando token...');
      return {
        accessToken: this.createToken(user).accessToken,
        nome: user.nome,
        id: user.id,
        email: user.email,
        foto: user.foto,
        message: 'Token gerado com sucesso',
      };
    } catch (error) {
      console.error('Erro no login:', error);
      throw new InternalServerErrorException('Erro ao tentar fazer login');
    }
  }

  async forget(email: string) {
    try {
      const user = await this.usuarioRepository.findOne({ where: { email } });

      if (!user) {
        throw new UnauthorizedException('Credenciais inválidas');
      }

      await this.milerService.sendMail({
        subject: 'Recuperação de senha',
        to: user.email,
        template: 'forget',
        context: { nome: user.nome },
      });

      return true;
    } catch (error) {
      console.error('Erro no forget:', error);
      throw new InternalServerErrorException(
        'Erro ao tentar recuperar a senha',
      );
    }
  }
}
