import * as bcrypt from 'bcryptjs';

const senhaArmazenada = '$2b$10$ggQD5XPJ22AWgxggnCVR1edA/wuhhUbKs0SJjvmo4z1MJWQj0MBRK';
const senhaFornecida = 'Gremio123';

async function testPassword() {
  const isPasswordValid = await bcrypt.compare(senhaFornecida, senhaArmazenada);
  console.log('Senha válida:', isPasswordValid);
}

testPassword();
