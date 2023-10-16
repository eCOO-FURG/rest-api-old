# 🌐 Fasfity eCOO API

Built based on Clean Architecture & Domain-Driven Design principles.

### 📚 Library

- Fastify
- Typescript

### 📌 How To Use

Clone repository
```bash
  git clone git@github.com:eCOO-FURG/rest-api.git && cd rest-api
```

Run using docker-compose
```bash
  docker-compose up
```

It is recommended using Prisma Studio
```bash
  npx prisma studio
```

A [SMTP Server](http://localhost:3010/) will be created on Local Network

### 🧪 Testing

#### Unit Tests

```bash
  npm run test
```

#### End-to-End Tests

```bash
  npm run test:e2e
```

### 📝 Functional Requirements

- [x] Must be to create an account;
- [x] Must be able to be authenticate;
- [ ] Must be able to register as a producer;
- [ ] Must be able to create an offer;

---

### Project anatomy

```
src                               → Application sources.
 └ core                           → Core business layer. Shared between all domains.
    └ entities                    → Enterprise business Entities (reference Objects).
          └ value-objects         → Complex attributes of an Entity.
 └ domain                         → Domain layer such as domain model objects, use-cases and repository interfaces.
     └ entities                   → Enterprise business Entities (reference Objects).
          └ value-objects         → Complex attributes of an Entity.
     └ repositories               → Repositories interface or contracts.
     └ use-cases                  → Application business rules.
          └ errors                → Business rules exceptions.
test                              → Source folder for unit testing instances such as repositories and factories.
 └ repositories                   → Mock repositories instances.

```
