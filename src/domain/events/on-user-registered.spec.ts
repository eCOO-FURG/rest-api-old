import { OnUserRegistered } from "./on-user-registered";
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

let fakeMailerSpy: SpyInstance;

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

    fakeMailerSpy = vi.spyOn(fakeMailer, "send");

    new OnUserRegistered(
      fakeMailer,
      inMemoryPeopleRepository,
      fakeEncrypter,
      fakeViewLoader
    );
  });

  it("should send a email when a new user is registered", async () => {
    await registerUseCase.execute({
      email: "johndoe@example.com",
      cellphone: "51987654321",
      password: "123456",
      first_name: "John",
      last_name: "Doe",
      cpf: "523.065.281-01",
    });

    await waitFor(() => {
      expect(fakeMailerSpy).toHaveBeenCalled();
    });
  });
});
