import { InMemorySessionsRepository } from "test/repositories/in-memory-sessions-repository";
import { AuthenticateWithOneTimePasswordUseCase } from "./authenticate-with-one-time-password";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { RegisterSessionUseCase } from "./register-session";
import { InMemoryOneTimePasswordsRepository } from "test/repositories/in-memory-one-time-passwords-repository";
import { OneTimePassword } from "../../entities/one-time-password";
import { WrongCredentialsError } from "../errors/wrong-credentials-error";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { User } from "../../entities/user";
import { UserNotVerifiedError } from "../errors/user-not-verified-error";

let inMemorySessionsRepository: InMemorySessionsRepository;
let fakeEncrypter: FakeEncrypter;
let registerSessionUseCase: RegisterSessionUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
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
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryOneTimePasswordsRepository =
      new InMemoryOneTimePasswordsRepository();
    sut = new AuthenticateWithOneTimePasswordUseCase(
      inMemoryUsersRepository,
      inMemoryOneTimePasswordsRepository,
      registerSessionUseCase
    );
  });

  it("should be able to authenticate an verified account with an valid one time password", async () => {
    const user = User.create({
      email: "johndoe@example.com",
      phone: "51987654321",
      password: "123456",
      first_name: "John",
      last_name: "Doe",
      cpf: "523.065.281-01",
      verified_at: new Date(),
    });

    await inMemoryUsersRepository.save(user);

    const oneTimePassword = OneTimePassword.create({
      user_id: user.id,
      value: "654321",
    });

    await inMemoryOneTimePasswordsRepository.save(oneTimePassword);

    const result = await sut.execute({
      email: "johndoe@example.com",
      one_time_password: "654321",
      ip_address: "test-address",
      user_agent: "test-user-agents",
    });

    expect(result.token).toBeTypeOf("string");
    expect(inMemoryOneTimePasswordsRepository.items[0].used).toBe(true);
  });

  it("should not be able to authenticate an account with an invalid email", async () => {
    const user = User.create({
      email: "johndoe@example.com",
      phone: "51987654321",
      password: "123456",
      first_name: "John",
      last_name: "Doe",
      cpf: "523.065.281-01",
      verified_at: new Date(),
    });

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
    const user = User.create({
      email: "johndoe@example.com",
      phone: "51987654321",
      password: "123456",
      first_name: "John",
      last_name: "Doe",
      cpf: "523.065.281-01",
      verified_at: new Date(),
    });

    await inMemoryUsersRepository.save(user);

    const oneTimePassword = OneTimePassword.create({
      user_id: user.id,
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
    const user = User.create({
      email: "johndoe@example.com",
      phone: "51987654321",
      password: "123456",
      first_name: "John",
      last_name: "Doe",
      cpf: "523.065.281-01",
    });

    await inMemoryUsersRepository.save(user);

    const oneTimePassword = OneTimePassword.create({
      user_id: user.id,
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
    ).rejects.toBeInstanceOf(UserNotVerifiedError);
  });
});
