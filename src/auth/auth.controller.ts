import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  Req,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-registro.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Usuario } from 'src/usuarios/usuario.decorator';
import { writeFile } from 'fs/promises';
import { join, extname } from 'path';
import { AuthForgetDTO } from './dto/auth-forget.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usuarioService: UsuariosService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  login(@Body() { email, senha }: AuthLoginDto) {
    return this.authService.login(email, senha);
  }

  @Post('registrar')
  registrar(@Body() body: AuthRegisterDto) {
    return this.usuarioService.create(body);
  }

  @UseGuards(AuthGuard)
  @Post('me')
  async me(@Req() req) {
    return { data: req.user };
  }

  @UseInterceptors(FileInterceptor('arquivo'))
  @UseGuards(AuthGuard)
  @Post('file')
  async file(
    @Usuario() user,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new FileTypeValidator({ fileType: 'image/png' }),
          new MaxFileSizeValidator({ maxSize: 1500 * 1500 }),
        ],
      }),
    )
    arquivo: Express.Multer.File,
  ) {
    const extensao = extname(arquivo.originalname);
    const nomeArquivo = `${user.id}-${Date.now()}${extensao}`;
    const caminhoArquivo = join(
      __dirname,
      '..',
      '..',
      'storage',
      'fotos',
      nomeArquivo,
    );

    await writeFile(caminhoArquivo, arquivo.buffer);

    const fotoUrl = `${nomeArquivo}`;
    const usuarioAtualizado = await this.usuarioService.updateUserPhoto(
      user.id,
      fotoUrl,
    );

    return {
      mensagem: 'Foto atualizada com sucesso!',
      usuario: usuarioAtualizado,
    };
  }

  @Post('forget')
  async forget(@Body() { email }: AuthForgetDTO) {
    return this.authService.forget(email);
  }
}
