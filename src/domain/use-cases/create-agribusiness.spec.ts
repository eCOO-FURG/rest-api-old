import { InMemoryAgribusinessesRepository } from "test/repositories/in-memory-agribusinesses-repository";
import { CreateAgribusinessUseCase } from "./create-agribusiness";
import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { Account } from "../entities/account";
import { Agribusiness } from "../entities/agribusiness";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists-error";

let inMemoryAccountsRepository: InMemoryAccountsRepository;
let inMemoryAgribusinessesRepository: InMemoryAgribusinessesRepository;
let sut: CreateAgribusinessUseCase;

describe("create agribusiness", () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository();
    inMemoryAgribusinessesRepository = new InMemoryAgribusinessesRepository();
    sut = new CreateAgribusinessUseCase(
      inMemoryAccountsRepository,
      inMemoryAgribusinessesRepository
    );
  });

  it("should be able to create a agribusiness", async () => {
    const account = Account.create({
      email: "johndoe@example.com",
      password: "123456",
      verified_at: new Date(),
    });

    inMemoryAccountsRepository.save(account);

    await sut.execute({
      account_id: account.id.toString(),
      caf: "123456",
      name: "fake-agribusiness",
    });

    expect(inMemoryAgribusinessesRepository.items[0]).toBeInstanceOf(
      Agribusiness
    );
  });

  it("should not be able to create and agribusiness that already exists", async () => {
    const account = Account.create({
      email: "johndoe@example.com",
      password: "123456",
      verified_at: new Date(),
    });

    inMemoryAccountsRepository.save(account);

    await sut.execute({
      account_id: account.id.toString(),
      caf: "123456",
      name: "fake-agribusiness",
    });

    await expect(() =>
      sut.execute({
        account_id: account.id.toString(),
        caf: "123456",
        name: "fake-agribusiness",
      })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });
});
