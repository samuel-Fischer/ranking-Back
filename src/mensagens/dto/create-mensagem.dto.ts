// src/mensagens/dto/create-mensagem.dto.ts
export class CreateMensagemDto {
    remetenteId: number;
    destinatarioId: number;
    mensagem: string;
    tipo: 'comum' | 'desafio'; // Define o tipo permitido
  }
  