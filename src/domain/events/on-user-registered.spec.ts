import { OnUserRegistered } from "./on-user-registered";
import { SendEmailUseCase } from "../use-cases/send-email";
import { RegisterUseCase } from "../use-cases/register";
import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { InMemoryPeopleRepository } from "test/repositories/in-memory-people-repository";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { SpyInstance } from "vitest";
import { FakeMailer } from "test/mail/fake-mailer";
import { FakeViewLoader } from "test/mail/fake-view-loader";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { waitFor } from "test/utils/wait-for";

let inMemoryAccountsRepository: InMemoryAccountsRepository;
let inMemoryPeopleRepository: InMemoryPeopleRepository;
let fakeHasher: FakeHasher;
let registerUseCase: RegisterUseCase;
let fakeMailer: FakeMailer;
let fakeViewLoader: FakeViewLoader;
let fakeEncrypter: FakeEncrypter;

let sendEmailUseCase: SendEmailUseCase;
let sendEmailUseCaseSpy: SpyInstance;

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

    sendEmailUseCase = new SendEmailUseCase(fakeMailer);
    sendEmailUseCaseSpy = vi.spyOn(sendEmailUseCase, "execute");

    new OnUserRegistered(
      sendEmailUseCase,
      inMemoryPeopleRepository,
      fakeEncrypter,
      fakeViewLoader
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

    await waitFor(() => {
      expect(sendEmailUseCaseSpy).toHaveBeenCalled();
    });
  });
});
