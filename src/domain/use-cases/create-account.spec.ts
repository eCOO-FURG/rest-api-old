import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { CreateAccountUseCase } from "./create-account";
import { Account } from "../entities/account";
import { AccountAlreadyExistsError } from "./errors/account-already-exists-error";

let inMemoryAccountsRepository: InMemoryAccountsRepository;
let sut: CreateAccountUseCase;

describe("create account", () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository();
    sut = new CreateAccountUseCase(inMemoryAccountsRepository);
  });

  it("should be able to able to create a new account", async () => {
    const result = await sut.execute({
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(result).toBeInstanceOf(Account);
    expect(inMemoryAccountsRepository.items[0]).toEqual(result);
  });

  it("should not be able to create an account with the same email twice", async () => {
    const email = "johndoe@example.com";

    await sut.execute({
      email,
      password: "123456",
    });

    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(AccountAlreadyExistsError);
  });
});
