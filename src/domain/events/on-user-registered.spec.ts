import { OnUserRegistered } from "./on-user-registered";
import { SendUserVerificationEmailUseCase } from "../use-cases/send-user-verification-email";
import { RegisterUseCase } from "../use-cases/register";
import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { InMemoryPeopleRepository } from "test/repositories/in-memory-people-repository";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { SpyInstance } from "vitest";
import { FakeMailer } from "test/mail/fake-mailer";
import { FakeViewLoader } from "test/mail/fake-view-loader";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";

let inMemoryAccountsRepository: InMemoryAccountsRepository;
let inMemoryPeopleRepository: InMemoryPeopleRepository;
let fakeHasher: FakeHasher;
let registerUseCase: RegisterUseCase;
let fakeMailer: FakeMailer;
let fakeViewLoader: FakeViewLoader;
let fakeEncrypter: FakeEncrypter;

let sendUserVerificationEmailUseCase: SendUserVerificationEmailUseCase;
let sendUserVerificationEmailUseCaseSpy: SpyInstance;

describe("on user registered", () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository();
    inMemoryPeopleRepository = new InMemoryPeopleRepository();
    fakeHasher = new FakeHasher();
    registerUseCase = new RegisterUseCase(
      inMemoryAccountsRepository,
      inMemoryPeopleRepository,
      fakeHasher
    );

    fakeMailer = new FakeMailer();
    fakeViewLoader = new FakeViewLoader();
    fakeEncrypter = new FakeEncrypter();
    sendUserVerificationEmailUseCase = new SendUserVerificationEmailUseCase(
      fakeMailer,
      fakeViewLoader,
      fakeEncrypter
    );
    sendUserVerificationEmailUseCaseSpy = vi.spyOn(
      sendUserVerificationEmailUseCase,
      "execute"
    );

    new OnUserRegistered(
      inMemoryPeopleRepository,
      sendUserVerificationEmailUseCase
    );
  });

  it("should send a email when a new user is registered", async () => {
    await registerUseCase.execute({
      email: "johndoe@example.com",
      password: "123456",
      first_name: "John",
      last_name: "Doe",
      cpf: "523.065.281-01",
    });

    expect(sendUserVerificationEmailUseCaseSpy).toHaveBeenCalled();
  });
});
