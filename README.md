# 🌐 Fasfity eCOO API 

Built based on Clean Architecture & Domain-Driven Design principles.

### 📚 Library 

- Fastify
- Typescript

### 📌 How To Use

```bash
  git clone git@github.com:eCOO-FURG/rest-api.git && cd rest-api
```

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

#### Producers
- [ ] Must be able to register;
- [ ] Must be able to authenticate;

#### Costumers
- [ ] Must be able to register;
- [ ] Must be able to authenticate;


---

### Project anatomy

```
src                               → Application sources.
  └ domain                        → Enterprise core business layer such as domain model objects (Aggregates, Entities, Value Objects) and repository interfaces.
test                              → Source folder for unit or functional tests.

