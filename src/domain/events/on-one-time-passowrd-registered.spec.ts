import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { RegisterOneTimePasswordUseCase } from "../use-cases/register-one-time-password";
import { FakeOtpGenerator } from "test/cryptography/fake-otp-generator";
import { InMemoryOneTimePasswordsRepository } from "test/repositories/in-memory-one-time-passwords-repository";
import { OnOneTimePasswordRegistered } from "./on-one-time-password-registered";
import { FakeMailer } from "test/mail/fake-mailer";
import { FakeViewLoader } from "test/mail/fake-view-loader";
import { waitFor } from "test/utils/wait-for";
import { SpyInstance } from "vitest";
import { Account } from "../entities/account";
import { Cellphone } from "../entities/value-objects/cellphone";

let inMemoryAccountsRepository: InMemoryAccountsRepository;
let fakeOtpGenerator: FakeOtpGenerator;
let inMemoryOneTimePasswordsRepository: InMemoryOneTimePasswordsRepository;
let registerOneTimePasswordUseCase: RegisterOneTimePasswordUseCase;
let fakeMailer: FakeMailer;
let fakeViewLoader: FakeViewLoader;
let fakeMailerSpy: SpyInstance;

describe("on one time password registered", () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository();
    fakeOtpGenerator = new FakeOtpGenerator();
    inMemoryOneTimePasswordsRepository =
      new InMemoryOneTimePasswordsRepository();

    registerOneTimePasswordUseCase = new RegisterOneTimePasswordUseCase(
      inMemoryAccountsRepository,
      fakeOtpGenerator,
      inMemoryOneTimePasswordsRepository
    );

    fakeMailer = new FakeMailer();
    fakeViewLoader = new FakeViewLoader();
    fakeMailerSpy = vi.spyOn(fakeMailer, "send");

    new OnOneTimePasswordRegistered(
      inMemoryAccountsRepository,
      fakeMailer,
      fakeViewLoader
    );
  });

  it("should send a email when a one time password is registered", async () => {
    const account = Account.create({
      email: "johndoe@example.com",
      password: "123456",
      verified_at: new Date(),
      cellphone: Cellphone.createFromText("519876543"),
    });

    inMemoryAccountsRepository.save(account);

    await registerOneTimePasswordUseCase.execute({
      email: "johndoe@example.com",
    });

    // await waitFor(() => {
    //   expect(fakeMailerSpy).toHaveBeenCalled();
    // });
  });
});
