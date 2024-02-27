import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { Account } from "../entities/account";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";
import { InMemorySessionsRepository } from "test/repositories/in-memory-sessions-repository";
import { Session } from "../entities/session";
import { AccountNotVerifiedError } from "./errors/account-not-verified-error";
import { Cellphone } from "../entities/value-objects/cellphone";
import { AuthenticateWithPasswordUseCase } from "./authenticate-with-password";
import { RegisterSessionUseCase } from "./register-session";

let inMemorySessionsRepository: InMemorySessionsRepository;
let fakeEncrypter: FakeEncrypter;
let registerSessionUseCase: RegisterSessionUseCase;
let inMemoryAccountsRepository: InMemoryAccountsRepository;
let fakeHasher: FakeHasher;
let sut: AuthenticateWithPasswordUseCase;

describe("authenticate", () => {
  beforeEach(() => {
    inMemorySessionsRepository = new InMemorySessionsRepository();
    fakeEncrypter = new FakeEncrypter();
    registerSessionUseCase = new RegisterSessionUseCase(
      inMemorySessionsRepository,
      fakeEncrypter
    );
    inMemoryAccountsRepository = new InMemoryAccountsRepository();
    fakeHasher = new FakeHasher();
    sut = new AuthenticateWithPasswordUseCase(
      inMemoryAccountsRepository,
      fakeHasher,
      registerSessionUseCase
    );
  });

  it("should be able to authenticate an verified account", async () => {
    const account = Account.create({
      email: "johndoe@example.com",
      password: await fakeHasher.hash("123456"),
      cellphone: Cellphone.createFromText("519876543"),
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
      cellphone: Cellphone.createFromText("519876543"),

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
      cellphone: Cellphone.createFromText("519876543"),
    });

    inMemoryAccountsRepository.save(account);

    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        password: "123456",
        ip_address: "ip_address",
        user_agent: "mozila-firefox 5.0",
      })
    ).rejects.toBeInstanceOf(AccountNotVerifiedError);
  });
});
