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

Ensure you have ts-node installed and run the seeds
```bash
  npx prisma migrate dev && npx prisma db seed && npm qdrant:seed
```
*Different seeds will be created based on the environment

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
*Do not forget the database must be running

---

### Project anatomy

```
src                             → Application sources.
  └ core                        → Core business layer. Shared between all domains.
    └ entities                  → Core Entities (reference Objects).
    └ errors                    → Common use-cases errors.
    └ events                    → Core event registration instances.
    └ types                     → Typescript generics.
  └ domain                      → Domain layer such as domain model objects, use-cases and repository.
    └ cryptography              → Cryptography interfaces or contracts.
    └ entities                  → Enterprise business Entities.
    └ events                    → Enterprise business Events (actions triggered by use-cases).
    └ mail                      → Mail service related contracts and views.
    └ repositories              → Repositories interfaces or contracts.
    └ search                    → Natural language processor contract.
    └ use-cases                 → Application business rules.
  └ infra                       → Technology implementation of the domain layer.
    └ @types                    → Fastify types related.
    └ container                 → Dependency injection modules registration.
    └ cryptography              → Cryptography module implementation.
    └ database                  → Prisma service, Qdrant service, entity mappers, repositories and collections.
    └ env                       → Environment variables build-time validation.
    └ http                      → HTTP layer.
    └ mail                      → Mail module implementation.
    └ search                    → Tensor-flow universal sentence encoder model.
    └ utils                     → DRY ensurance.
test
  └ cryptography                → Mock cryptography services instances.
  └ factories                   → Use cases common proccess.
  └ mail                        → Mock mail services instances.
  └ repositories                → Mock repositories instances.
  └ utils                       → Useful functions for tests deppuring.
```


### 📝 Functional Requirements

- [x] Register;
- [x] Authenticate;
- [x] Create an agribusiness;
- [x] Offer products;
- [x] Search offers by semantic search;
