// Objective: Define the data transfer object of the ranking entity.
// esse arquivo é o DTO (Data Transfer Object) que vai ser usado para transferir dados entre o cliente e o servidor
// é uma forma de garantir que os dados que estão sendo enviados estão corretos e são válidos


export class RankingDto {
    id: number;
    usuarioId: number;
    pontuacao: number;
    }
    
