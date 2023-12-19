FROM node:18.12.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

RUN npx prisma generate

EXPOSE 3333

CMD ["npm", "run", "start:dev"]
