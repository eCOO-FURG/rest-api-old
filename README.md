# 🌐 Fasfity eCOO API

Built based on Clean Architecture & Domain-Driven Design principles.

### 📚 Library

- Fastify
- Typescript
- Awilix
- Prisma
- Zod

### 📌 How To Use

Clone repository
```bash
  git clone git@github.com:eCOO-FURG/rest-api.git && cd rest-api
```

Run using docker-compose
```bash
  docker-compose up
```

Ensure you have [ts-node](https://www.npmjs.com/package/ts-node) installed and run the seed
```bash
  npx prisma migrate dev && npx prisma db seed
```

### 🧪 Testing

#### Unit Tests

```bash
  npm run test
```

### 🚀 Development

Some actions are fast forwarded on the development environment:

  └ Account verification
  
  └ Order settlement
  
It is recommended using Prisma Studio
```bash
  npx prisma studio
```

A [SMTP Server](http://localhost:3010/) will be created on Local Network. It shall retrieve all application sent emails.
