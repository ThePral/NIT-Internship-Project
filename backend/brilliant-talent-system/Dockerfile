FROM node:20-alpine

WORKDIR /app

RUN npm install -g npm@latest

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

EXPOSE ${PORT:-3000}

CMD ["npm", "run", "start:dev"]
