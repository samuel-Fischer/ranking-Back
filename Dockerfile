FROM node:16.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g @nestjs/cli

COPY . .

CMD ["npm", "run", "start:dev"]
