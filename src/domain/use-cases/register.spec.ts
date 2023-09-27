import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { RegisterUseCase } from "./register";
import { Account } from "../entities/account";
import { AccountAlreadyExistsError } from "./errors/account-already-exists-error";
import { InMemoryPeopleRepository } from "test/repositories/in-memory-people-repository";
import { Person } from "../entities/person";

let inMemoryAccountsRepository: InMemoryAccountsRepository;
let inMemoryPeopleRepository: InMemoryPeopleRepository;
let sut: RegisterUseCase;

describe("create account", () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository();
    inMemoryPeopleRepository = new InMemoryPeopleRepository();
    sut = new RegisterUseCase(
      inMemoryAccountsRepository,
      inMemoryPeopleRepository
    );
  });

  it("should be able to able to register", async () => {
    await sut.execute({
      email: "johndoe@example.com",
      password: "123456",
      first_name: "John",
      last_name: "Doe",
      cpf: "523.065.281-01",
    });

    expect(inMemoryAccountsRepository.items[0]).toBeInstanceOf(Account);
    expect(inMemoryPeopleRepository.items[0]).toBeInstanceOf(Person);
  });

  it("should not be able to register with the same email twice", async () => {
    const email = "johndoe@example.com";

    await sut.execute({
      email,
      password: "123456",
      first_name: "John",
      last_name: "Doe",
      cpf: "523.065.281-01",
    });

    await expect(() =>
      sut.execute({
        email,
        password: "123456",
        first_name: "Rodrigo",
        last_name: "Goes",
        cpf: "523.065.281-02",
      })
    ).rejects.toBeInstanceOf(AccountAlreadyExistsError);
  });

  it("should not be able to create an account with the same CPF twice", async () => {
    const cpf = "523.065.281-01";

    await sut.execute({
      email: "johndoe@example.com",
      password: "123456",
      first_name: "John",
      last_name: "Doe",
      cpf,
    });

    await expect(() =>
      sut.execute({
        email: "rodrigogoes@example.com",
        password: "123456",
        first_name: "Rodrigo",
        last_name: "Goes",
        cpf,
      })
    ).rejects.toBeInstanceOf(AccountAlreadyExistsError);
  });
});
