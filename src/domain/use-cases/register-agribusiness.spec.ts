import { InMemoryAgribusinessesRepository } from "test/repositories/in-memory-agribusinesses-repository";
import { RegisterAgribusinessUseCase } from "./register-agribusiness";
import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { Account } from "../entities/account";
import { Agribusiness } from "../entities/agribusiness";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists-error";
import { Cellphone } from "../entities/value-objects/cellphone";

let inMemoryAccountsRepository: InMemoryAccountsRepository;
let inMemoryAgribusinessesRepository: InMemoryAgribusinessesRepository;
let sut: RegisterAgribusinessUseCase;

describe("create agribusiness", () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository();
    inMemoryAgribusinessesRepository = new InMemoryAgribusinessesRepository();
    sut = new RegisterAgribusinessUseCase(
      inMemoryAccountsRepository,
      inMemoryAgribusinessesRepository
    );
  });

  it("should be able to create a agribusiness", async () => {
    const account = Account.create({
      email: "johndoe@example.com",
      password: "123456",
      verified_at: new Date(),
      cellphone: Cellphone.createFromText("519876543"),
    });

    inMemoryAccountsRepository.save(account);

    await sut.execute({
      account_id: account.id.toString(),
      caf: "123456",
      name: "fake-agribusiness",
      active: true,
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
      cellphone: Cellphone.createFromText("519876543"),
    });

    inMemoryAccountsRepository.save(account);

    await sut.execute({
      account_id: account.id.toString(),
      caf: "123456",
      name: "fake-agribusiness",
      active: true,
    });

    await expect(() =>
      sut.execute({
        account_id: account.id.toString(),
        caf: "123456",
        name: "fake-agribusiness",
        active: true,
      })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });
});
