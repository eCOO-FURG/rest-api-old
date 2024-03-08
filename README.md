# 🌐 Fasfity eCOO API

Built based on Clean Architecture & Domain-Driven Design principles.

### 📚 Library

- Fastify
- Typescript
- Awilix
- Prisma
- Zod

### 🚀 How To Use

Clone repository:

```bash
  git clone git@github.com:eCOO-FURG/rest-api.git && cd rest-api
```

Run using docker-compose:

```bash
  docker-compose up
```

Ensure you have [ts-node](https://www.npmjs.com/package/ts-node) installed and run the seeds:

```bash
  npx prisma migrate dev && npx prisma db seed && npm run qdrant:seed
```



### 🧪 Testing

Check all unit tests:

```bash
  npm run test
```

### 📌 Notes 

A SMTP server will be created on [local network](http://localhost:3010/). It shall retrieve all application sent emails when on development environment.

It is recommend usign prisma studio. It can be initialized using:

```bash
  npx prisma studio
```

Check default seeds for each environemnt on /prisma/seeds.
