import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { Account } from "../entities/account";
import { Cellphone } from "../entities/value-objects/cellphone";
import { RegisterOneTimePasswordUseCase } from "./register-one-time-password";
import { FakeOtpGenerator } from "test/cryptography/fake-otp-generator";
import { InMemoryOneTimePasswordsRepository } from "test/repositories/in-memory-one-time-passwords-repository";
import { OneTimePassword } from "../entities/one-time-password";

let inMemoryAccountsRepository: InMemoryAccountsRepository;
let fakeOtpGenerator: FakeOtpGenerator;
let inMemoryOneTimePasswordsRepository: InMemoryOneTimePasswordsRepository;
let sut: RegisterOneTimePasswordUseCase;

describe("register one time password", () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository();
    fakeOtpGenerator = new FakeOtpGenerator();
    inMemoryOneTimePasswordsRepository =
      new InMemoryOneTimePasswordsRepository();
    sut = new RegisterOneTimePasswordUseCase(
      inMemoryAccountsRepository,
      fakeOtpGenerator,
      inMemoryOneTimePasswordsRepository
    );
  });

  it("should be able to register an one time password", async () => {
    const account = Account.create({
      email: "johndoe@example.com",
      password: "123456",
      verified_at: new Date(),
      cellphone: Cellphone.createFromText("519876543"),
    });

    inMemoryAccountsRepository.save(account);

    await sut.execute({
      email: "johndoe@example.com",
    });

    expect(inMemoryOneTimePasswordsRepository.items[0]).toBeInstanceOf(
      OneTimePassword
    );
  });

  it("should expire the previous one time password once a new one is registered", async () => {
    const account = Account.create({
      email: "johndoe@example.com",
      password: "123456",
      verified_at: new Date(),
      cellphone: Cellphone.createFromText("519876543"),
    });

    inMemoryAccountsRepository.save(account);

    await sut.execute({
      email: "johndoe@example.com",
    });

    await sut.execute({
      email: "johndoe@example.com",
    });

    expect(inMemoryOneTimePasswordsRepository.items[0].used).toBe(true);
  });
});
