import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { AuthenticateUseCase } from "./authenticate";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { Account } from "../entities/account";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";
import { InMemorySessionsRepository } from "test/repositories/in-memory-sessions-repository";
import { Session } from "../entities/session";

let inMemoryAccountsRepository: InMemoryAccountsRepository;
let inMemorySessionsRepository: InMemorySessionsRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateUseCase;

describe("authenticate", () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository();
    inMemorySessionsRepository = new InMemorySessionsRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateUseCase(
      inMemoryAccountsRepository,
      inMemorySessionsRepository,
      fakeHasher,
      fakeEncrypter
    );
  });

  it("should be able to create a session and return a access token", async () => {
    const account = Account.create({
      email: "johndoe@example.com",
      password: await fakeHasher.hash("123456"),
    });

    inMemoryAccountsRepository.save(account);

    const result = await sut.execute({
      email: "johndoe@example.com",
      password: "123456",
      ip_address: "1",
    });

    expect(inMemorySessionsRepository.items[0]).toBeInstanceOf(Session);
    expectTypeOf(result).toMatchTypeOf<{ access_token: string }>;
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
        ip_address: "ip_address",
      })
    ).rejects.toBeInstanceOf(WrongCredentialsError);
  });
});
