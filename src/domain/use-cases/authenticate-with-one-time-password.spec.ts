import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { InMemorySessionsRepository } from "test/repositories/in-memory-sessions-repository";
import { AuthenticateWithOneTimePasswordUseCase } from "./authenticate-with-one-time-password";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { RegisterSessionUseCase } from "./register-session";
import { InMemoryOneTimePasswordsRepository } from "test/repositories/in-memory-one-time-passwords-repository";
import { Cellphone } from "../entities/value-objects/cellphone";
import { Account } from "../entities/account";
import { OneTimePassword } from "../entities/one-time-password";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";
import { AccountNotVerifiedError } from "./errors/account-not-verified-error";

let inMemorySessionsRepository: InMemorySessionsRepository;
let fakeEncrypter: FakeEncrypter;
let registerSessionUseCase: RegisterSessionUseCase;
let inMemoryAccountsRepository: InMemoryAccountsRepository;
let inMemoryOneTimePasswordsRepository: InMemoryOneTimePasswordsRepository;
let sut: AuthenticateWithOneTimePasswordUseCase;

describe("authenticate with one time password", () => {
  beforeEach(() => {
    inMemorySessionsRepository = new InMemorySessionsRepository();
    fakeEncrypter = new FakeEncrypter();
    registerSessionUseCase = new RegisterSessionUseCase(
      inMemorySessionsRepository,
      fakeEncrypter
    );
    inMemoryAccountsRepository = new InMemoryAccountsRepository();
    inMemoryOneTimePasswordsRepository =
      new InMemoryOneTimePasswordsRepository();
    sut = new AuthenticateWithOneTimePasswordUseCase(
      inMemoryAccountsRepository,
      inMemoryOneTimePasswordsRepository,
      registerSessionUseCase
    );
  });

  it("should be able to authenticate an verified account with an valid one time password", async () => {
    const account = Account.create({
      email: "johndoe@example.com",
      password: "123456",
      cellphone: Cellphone.createFromText("519876543"),
      verified_at: new Date(),
    });

    inMemoryAccountsRepository.save(account);

    const oneTimePassword = OneTimePassword.create({
      account_id: account.id,
      value: "654321",
    });

    await inMemoryOneTimePasswordsRepository.save(oneTimePassword);

    const result = await sut.execute({
      email: "johndoe@example.com",
      ip_address: "test-address",
      one_time_password: "654321",
      user_agent: "test-user-agents",
    });

    expect(result).toHaveProperty("accessToken");
    expect(inMemoryOneTimePasswordsRepository.items[0].used).toBe(true);
  });

  it("should not be able to authenticate an account with an invalid email", async () => {
    const account = Account.create({
      email: "johndoe@example.com",
      password: "123456",
      cellphone: Cellphone.createFromText("519876543"),

      verified_at: new Date(),
    });

    inMemoryAccountsRepository.save(account);

    await expect(() =>
      sut.execute({
        email: "wrong-email",
        one_time_password: "123456",
        ip_address: "ip_address",
        user_agent: "mozila-firefox 5.0",
      })
    ).rejects.toBeInstanceOf(WrongCredentialsError);
  });

  it("should not be able to authenticate an account with an invalid one time password", async () => {
    const account = Account.create({
      email: "johndoe@example.com",
      password: "123456",
      cellphone: Cellphone.createFromText("519876543"),
      verified_at: new Date(),
    });

    inMemoryAccountsRepository.save(account);

    const oneTimePassword = OneTimePassword.create({
      account_id: account.id,
      value: "654321",
    });

    await inMemoryOneTimePasswordsRepository.save(oneTimePassword);

    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        ip_address: "test-address",
        one_time_password: "123456",
        user_agent: "test-user-agents",
      })
    ).rejects.toBeInstanceOf(WrongCredentialsError);
  });

  it("should not be able to authenticate an unverified account", async () => {
    const account = Account.create({
      email: "johndoe@example.com",
      password: "123456",
      cellphone: Cellphone.createFromText("519876543"),
    });

    await inMemoryAccountsRepository.save(account);

    const oneTimePassword = OneTimePassword.create({
      account_id: account.id,
      value: "654321",
    });

    await inMemoryOneTimePasswordsRepository.save(oneTimePassword);

    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        ip_address: "test-address",
        one_time_password: "654321",
        user_agent: "test-user-agents",
      })
    ).rejects.toBeInstanceOf(AccountNotVerifiedError);
  });
});
