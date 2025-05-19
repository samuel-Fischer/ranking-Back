//esse é o arquivo que vai ser usado para validar os dados que vão ser enviados para o banco de dados
//chama-se DTO (Data Transfer Object) e é uma classe que vai ser usada para transferir dados entre o cliente e o servidor
//é uma forma de garantir que os dados que estão sendo enviados estão corretos e são válidos
//chamado de create-ranking.dto.ts
import { IsInt, IsNumber, IsString} from "class-validator";


export class CreateRankingDto {

    @IsNumber()
    @IsInt()
    pontuacao: number;

    @IsNumber()
    @IsInt()
    usuarioId: number;

    

}
