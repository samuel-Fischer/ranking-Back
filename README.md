<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="200" alt="NestJS Logo" />
</p>

<p align="center">
  <img src="https://img.shields.io/github/last-commit/samuel-Fischer/ranking-back" alt="Last commit">
  <img src="https://img.shields.io/github/repo-size/samuel-Fischer/ranking-back" alt="Repo size">
  <img src="https://img.shields.io/github/forks/samuel-Fischer/ranking-back?style=social" alt="Forks">
  <img src="https://img.shields.io/github/stars/samuel-Fischer/ranking-back?style=social" alt="Stars">
</p>

# 🏆 Ranking Padel - Back-end (Parte 1/2)

Este é o back-end do projeto **Ranking Padel**, desenvolvido com [NestJS](https://nestjs.com/). Ele é responsável por lidar com autenticação, cadastro de usuários, envio de fotos de perfil, registro de partidas e mais.

> 🔗 Este repositório é a **Parte 1/2** do projeto completo. [A Parte 2](https://github.com/samuel-Fischer/ranking-Front) (front-end em Next.js) está disponível separadamente.

---

## 📝 Artigo sobre o projeto

Escrevi um artigo no Medium explicando o processo de desenvolvimento completo deste projeto. Você pode ler aqui:

🔗 [Veja o artigo no Medium](https://medium.com/@samuelsenacrs/ranking-padel-sistema-de-gerenciamento-de-ranking-41a1c22e0bbd)

## 🚀 Tecnologias

- Node.js + NestJS
- TypeScript
- TypeORM
- JWT
- Prettier e ESLint
- Docker e PostgreSQL

---

## ⚙️ Pré-requisitos

- [Docker](https://www.docker.com/)
- (Opcional) [Insomnia](https://insomnia.rest/download) para testar as rotas da API
- (Opcional) [DBeaver](https://dbeaver.io/download/) para uma visualização do banco de dados

---

## 🧪 Como rodar o projeto

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/ranking-back.git

# 2. Acesse a pasta do projeto
cd ranking-back

# 3. Crie um arquivo .env com base no .env.example

# 4. Suba os containers (pode demorar um pouco no primeiro build)
docker compose up --build
```

> 📌 A API rodará em: `http://localhost:3000`

---

### 🛠 Correção de bug do bcrypt (caso aconteça)

Caso você enfrente um relacionado ao bcrypt, faça o seguinte:

```bash
# 1. Acesse o container do back-end
docker exec -it padel-API sh

# 2. Desinstale o bcrypt
npm uninstall bcrypt

# 3. Reinstale o bcrypt dentro do container
npm install bcrypt
```

---

## 📬 Testando com Insomnia

Você pode testar as rotas da API usando o Insomnia.  
Caso queira, importe o arquivo de coleção disponível na pasta `/insomnia`.

🔗 [Importar Collection do Insomnia](https://raw.githubusercontent.com/samuel-Fischer/ranking-back/main/insomnia/Insomnia_2025-05-19.json)
---

## 📁 Scripts úteis

```bash
# Dev
npm run start:dev
```

---

## 📎 Parte 2/2

O front-end (Next.js) está disponível no repositório:  
🔗 `https://github.com/samuel-Fischer/ranking-Front`

---


### 🏷️ Tags

`nestjs` `docker` `typescript` `jwt` `api` `padel` `ranking`

---
