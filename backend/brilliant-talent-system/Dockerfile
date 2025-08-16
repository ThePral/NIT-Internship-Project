FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

EXPOSE ${PORT:-3000}

CMD ["npm", "run", "start:dev"]