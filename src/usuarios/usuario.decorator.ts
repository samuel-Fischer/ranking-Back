import {
  ExecutionContext,
  NotFoundException,
  createParamDecorator,
} from '@nestjs/common';

export const Usuario = createParamDecorator(
  (filter: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    // Logando a requisição inteira (cuidado com dados sensíveis)
    console.log('Request:', request);

    // Verificar se "usuario" está na requisição
    console.log('Request.usuario:', request.user);

    if (request.user) {
      if (filter) {
        console.log(`Retornando filtro: ${filter}`);
        return request.user[filter];
      } else {
        console.log('Retornando usuário completo');
        return request.user;
      }
    } else {
      console.error('Usuário não encontrado! Lançando exceção.');
      throw new NotFoundException('Usuário não encontrado!');
    }
  },
);
