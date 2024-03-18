import { RegisterOneTimePasswordUseCase } from "./register-one-time-password";
import { FakeOtpGenerator } from "test/cryptography/fake-otp-generator";
import { InMemoryOneTimePasswordsRepository } from "test/repositories/in-memory-one-time-passwords-repository";
import { OneTimePassword } from "../../entities/one-time-password";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { User } from "../../entities/user";

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeOtpGenerator: FakeOtpGenerator;
let inMemoryOneTimePasswordsRepository: InMemoryOneTimePasswordsRepository;
let sut: RegisterOneTimePasswordUseCase;

describe("register one time password", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeOtpGenerator = new FakeOtpGenerator();
    inMemoryOneTimePasswordsRepository =
      new InMemoryOneTimePasswordsRepository();
    sut = new RegisterOneTimePasswordUseCase(
      inMemoryUsersRepository,
      fakeOtpGenerator,
      inMemoryOneTimePasswordsRepository
    );
  });

  it("should be able to register an one time password", async () => {
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

    await sut.execute({
      email: "johndoe@example.com",
    });

    expect(inMemoryOneTimePasswordsRepository.items[0]).toBeInstanceOf(
      OneTimePassword
    );
  });

  it("should expire the previous one time password once a new one is registered", async () => {
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

    await sut.execute({
      email: "johndoe@example.com",
    });

    await sut.execute({
      email: "johndoe@example.com",
    });

    expect(inMemoryOneTimePasswordsRepository.items[0].used).toBe(true);
  });
});
