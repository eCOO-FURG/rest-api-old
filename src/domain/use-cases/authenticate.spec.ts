import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { AuthenticateUseCase } from "./authenticate";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { Account } from "../entities/account";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";

let inMemoryAccountsRepository: InMemoryAccountsRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateUseCase;

describe("authenticate", () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateUseCase(
      inMemoryAccountsRepository,
      fakeHasher,
      fakeEncrypter
    );
  });

  it("should be able to authenticate an account", async () => {
    const account = Account.create({
      email: "johndoe@example.com",
      password: await fakeHasher.hash("123456"),
    });

    inMemoryAccountsRepository.save(account);

    const result = await sut.execute({
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(result).toEqual(expect.any(String));
  });

  it("should not be able to authenticate an account with wrong credentials", async () => {
    const account = Account.create({
      email: "johndoe@example.com",
      password: await fakeHasher.hash("123456"),
    });

    inMemoryAccountsRepository.save(account);

    await expect(() =>
      sut.execute({
        email: "wrong-email",
        password: "wrong-password",
      })
    ).rejects.toBeInstanceOf(WrongCredentialsError);
  });
});
