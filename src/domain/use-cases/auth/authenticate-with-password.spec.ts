import { FakeHasher } from "test/cryptography/fake-hasher";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { WrongCredentialsError } from "../errors/wrong-credentials-error";
import { InMemorySessionsRepository } from "test/repositories/in-memory-sessions-repository";
import { Session } from "../../entities/session";
import { AuthenticateWithPasswordUseCase } from "./authenticate-with-password";
import { RegisterSessionUseCase } from "./register-session";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { User } from "../../entities/user";
import { UserNotVerifiedError } from "../errors/user-not-verified-error";

let inMemorySessionsRepository: InMemorySessionsRepository;
let fakeEncrypter: FakeEncrypter;
let registerSessionUseCase: RegisterSessionUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let sut: AuthenticateWithPasswordUseCase;

describe("authenticate with password", () => {
  beforeEach(() => {
    inMemorySessionsRepository = new InMemorySessionsRepository();
    fakeEncrypter = new FakeEncrypter();
    registerSessionUseCase = new RegisterSessionUseCase(
      inMemorySessionsRepository,
      fakeEncrypter
    );
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    sut = new AuthenticateWithPasswordUseCase(
      inMemoryUsersRepository,
      fakeHasher,
      registerSessionUseCase
    );
  });

  it("should be able to authenticate an verified account", async () => {
    const hashedPassword = await fakeHasher.hash("123456");

    const user = User.create({
      email: "johndoe@example.com",
      phone: "51987654321",
      password: hashedPassword,
      first_name: "John",
      last_name: "Doe",
      cpf: "523.065.281-01",
      verified_at: new Date(),
    });

    await inMemoryUsersRepository.save(user);

    const result = await sut.execute({
      email: "johndoe@example.com",
      password: "123456",
      ip_address: "127.0.0.1",
      user_agent: "mozila-firefox 5.0",
    });

    expect(inMemorySessionsRepository.items[0]).toBeInstanceOf(Session);
    expectTypeOf(result).toMatchTypeOf<{ token: string }>;
  });

  it("should not be able to authenticate an account with wrong credentials", async () => {
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
    const hashedPassword = await fakeHasher.hash("123456");

    const user = User.create({
      email: "johndoe@example.com",
      phone: "51987654321",
      password: hashedPassword,
      first_name: "John",
      last_name: "Doe",
      cpf: "523.065.281-01",
    });

    await inMemoryUsersRepository.save(user);

    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        password: "123456",
        ip_address: "ip_address",
        user_agent: "mozila-firefox 5.0",
      })
    ).rejects.toBeInstanceOf(UserNotVerifiedError);
  });
});
