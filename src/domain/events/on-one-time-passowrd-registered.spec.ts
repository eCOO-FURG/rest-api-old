import { RegisterOneTimePasswordUseCase } from "../use-cases/auth/register-one-time-password";
import { FakeOtpGenerator } from "test/cryptography/fake-otp-generator";
import { InMemoryOneTimePasswordsRepository } from "test/repositories/in-memory-one-time-passwords-repository";
import { OnOneTimePasswordRegistered } from "./on-one-time-password-registered";
import { FakeMailer } from "test/mail/fake-mailer";
import { FakeViewLoader } from "test/mail/fake-view-loader";
import { waitFor } from "test/utils/wait-for";
import { SpyInstance } from "vitest";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { User } from "../entities/user";

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeOtpGenerator: FakeOtpGenerator;
let inMemoryOneTimePasswordsRepository: InMemoryOneTimePasswordsRepository;
let registerOneTimePasswordUseCase: RegisterOneTimePasswordUseCase;
let fakeMailer: FakeMailer;
let fakeViewLoader: FakeViewLoader;
let fakeMailerSpy: SpyInstance;

describe("on one time password registered", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeOtpGenerator = new FakeOtpGenerator();
    inMemoryOneTimePasswordsRepository =
      new InMemoryOneTimePasswordsRepository();

    registerOneTimePasswordUseCase = new RegisterOneTimePasswordUseCase(
      inMemoryUsersRepository,
      fakeOtpGenerator,
      inMemoryOneTimePasswordsRepository
    );

    fakeMailer = new FakeMailer();
    fakeViewLoader = new FakeViewLoader();
    fakeMailerSpy = vi.spyOn(fakeMailer, "send");

    new OnOneTimePasswordRegistered(
      inMemoryUsersRepository,
      fakeMailer,
      fakeViewLoader
    );
  });

  it("should send a email when a one time password is registered", async () => {
    const user = User.create({
      email: "test@gmail.com",
      phone: "51987654321",
      password: "123456",
      first_name: "John",
      last_name: "Doe",
      cpf: "523.065.281-01",
    });

    await inMemoryUsersRepository.save(user);

    await registerOneTimePasswordUseCase.execute({
      email: "test@gmail.com",
    });

    await waitFor(() => {
      expect(fakeMailerSpy).toHaveBeenCalled();
    });
  });
});
