import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { AuthenticateUseCase } from "./authenticate";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { Account } from "../entities/account";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";
import { InMemorySessionsRepository } from "test/repositories/in-memory-sessions-repository";
import { Session } from "../entities/session";
import { AccountNotVerified } from "./errors/account-not-verified";

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

  it("should be able to authenticate an verified account", async () => {
    const account = Account.create({
      email: "johndoe@example.com",
      password: await fakeHasher.hash("123456"),
      verified_at: new Date(),
    });

    inMemoryAccountsRepository.save(account);

    const result = await sut.execute({
      email: "johndoe@example.com",
      password: "123456",
      ip_address: "127.0.0.1",
      user_agent: "mozila-firefox 5.0",
    });

    expect(inMemorySessionsRepository.items[0]).toBeInstanceOf(Session);
    expectTypeOf(result).toMatchTypeOf<{ access_token: string }>;
  });

  it("should not be able to authenticate an account with wrong credentials", async () => {
    const account = Account.create({
      email: "johndoe@example.com",
      password: await fakeHasher.hash("123456"),
      verified_at: new Date(),
    });

    inMemoryAccountsRepository.save(account);

    await expect(() =>
      sut.execute({
        email: "wrong-email",
        password: "wrong-password",
        ip_address: "ip_address",
        user_agent: "mozila-firefox 5.0",
      })
    ).rejects.toBeInstanceOf(WrongCredentialsError);
  });

  it("should not be able to authenticate an account that is not verified", async () => {
    const account = Account.create({
      email: "johndoe@example.com",
      password: await fakeHasher.hash("123456"),
    });

    inMemoryAccountsRepository.save(account);

    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        password: "123456",
        ip_address: "ip_address",
        user_agent: "mozila-firefox 5.0",
      })
    ).rejects.toBeInstanceOf(AccountNotVerified);
  });
});
