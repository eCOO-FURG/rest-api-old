import { diContainer as container } from "@fastify/awilix";
import { Lifetime, asClass, asFunction, asValue } from "awilix";
import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { InMemoryPeopleRepository } from "test/repositories/in-memory-people-repository";
import { RegisterUseCase } from "@/domain/use-cases/register";
import { AuthenticateUseCase } from "@/domain/use-cases/authenticate";
import { BcrypterHasher } from "../cryptography/bcrypt-hasher";
import { JwtEncrypter } from "../cryptography/jwt-encrypter";
import * as JwtService from "jsonwebtoken";

// Use-cases dependencies
container.register({
  accontsRepository: asClass(InMemoryAccountsRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
  peopleRepository: asClass(InMemoryPeopleRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
  hasher: asClass(BcrypterHasher),
  encrypter: asFunction(() => {
    return new JwtEncrypter(JwtService);
  }),
});

// Use-cases instances
export const useCases = {
  registerUseCase: asFunction(
    ({ accontsRepository, peopleRepository, hasher }) => {
      return new RegisterUseCase(accontsRepository, peopleRepository, hasher);
    },
    {
      lifetime: Lifetime.SCOPED,
    }
  ),
  authenticateUseCase: asFunction(
    ({ accontsRepository, hasher, encrypter }) => {
      return new AuthenticateUseCase(accontsRepository, hasher, encrypter);
    }
  ),
};
