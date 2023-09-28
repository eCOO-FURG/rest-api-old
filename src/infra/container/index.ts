import { diContainer as container } from "@fastify/awilix";
import { Lifetime, asClass, asFunction, asValue } from "awilix";
import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { InMemoryPeopleRepository } from "test/repositories/in-memory-people-repository";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { RegisterUseCase } from "@/domain/use-cases/register";

// Use-cases dependencies
container.register({
  accontsRepository: asClass(InMemoryAccountsRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
  peopleRepository: asClass(InMemoryPeopleRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
  fakeHasher: asClass(FakeHasher),
});

export const useCases = {
  registerUseCase: asFunction(
    ({ accontsRepository, peopleRepository, fakeHasher }) => {
      return new RegisterUseCase(
        accontsRepository,
        peopleRepository,
        fakeHasher
      );
    },
    {
      lifetime: Lifetime.SCOPED,
    }
  ),
};
