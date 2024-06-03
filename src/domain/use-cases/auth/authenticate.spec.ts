// Entities
import { Session } from "@/domain/entities/session";

// Repositories
import { InMemorySessionsRepository } from "test/repositories/in-memory-sessions-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { InMemoryOneTimePasswordsRepository } from "test/repositories/in-memory-one-time-passwords-repository";

// Services
import { FakeHasher } from "test/cryptography/fake-hasher";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";

// Factories
import { UserFactory } from "test/factories/user-factory";
import { OtpFactory } from "test/factories/otp-factory";

// Errors
import { WrongCredentialsError } from "../errors/wrong-credentials-error";
import { UserNotVerifiedError } from "../errors/user-not-verified-error";
import { PasswordNotSettedError } from "../errors/password-not-setted";

// Use-cases
import { AuthenticateUseCase } from "@/domain/use-cases/auth/authenticate";

let inMemorySessionsRepository: InMemorySessionsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryOneTimePasswordsRepository: InMemoryOneTimePasswordsRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateUseCase;

interface AuthenticateUseCaseResponse {
  token: string;
}

describe("authenticate", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemorySessionsRepository = new InMemorySessionsRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    inMemoryOneTimePasswordsRepository =
      new InMemoryOneTimePasswordsRepository();
    sut = new AuthenticateUseCase(
      inMemoryUsersRepository,
      inMemorySessionsRepository,
      inMemoryOneTimePasswordsRepository,
      fakeEncrypter,
      fakeHasher
    );
  });

  it("should be able to authenticate via basic auth", async () => {
    const password = "12345678";
    const hashedPassword = await fakeHasher.hash("12345678");

    const user = UserFactory.create({
      password: hashedPassword,
      verified: true,
    });

    await inMemoryUsersRepository.save(user);

    if (user.password) {
      const result = await sut.execute({
        email: user.email,
        password,
        ip_address: "127.0.0.1",
        user_agent: "mozila-firefox 5.0",
        type: "BASIC",
      });

      const session = inMemorySessionsRepository.items[0];

      expect(session).toBeInstanceOf(Session);
      expectTypeOf(result).toMatchTypeOf<AuthenticateUseCaseResponse>;
    }
  });

  it("should be able to authenticate via otp", async () => {
    const user = UserFactory.create({
      verified: true,
    });

    await inMemoryUsersRepository.save(user);

    const otp = OtpFactory.create({
      user_id: user.id,
    });

    await inMemoryOneTimePasswordsRepository.save(otp);

    const result = await sut.execute({
      email: user.email,
      password: otp.value,
      ip_address: "127.0.0.1",
      user_agent: "mozila-firefox 5.0",
      type: "OTP",
    });

    expect(inMemoryOneTimePasswordsRepository.items[0].used).toBe(true);
    expect(inMemorySessionsRepository.items[0]).toBeInstanceOf(Session);
    expectTypeOf(result).toMatchTypeOf<AuthenticateUseCaseResponse>;
  });

  it("should not be able to authenticate via basic with wrong credentials", async () => {
    const user = UserFactory.create({
      password: "12345678",
      verified: true,
    });

    await inMemoryUsersRepository.save(user);

    await expect(() =>
      sut.execute({
        email: user.email,
        password: "87654321",
        ip_address: "127.0.0.1",
        user_agent: "mozila-firefox 5.0",
        type: "BASIC",
      })
    ).rejects.toBeInstanceOf(WrongCredentialsError);
  });

  it("should not be able to authenticate via otp with wrong credentials", async () => {
    const user = UserFactory.create({
      verified: true,
    });

    await inMemoryUsersRepository.save(user);

    await expect(() =>
      sut.execute({
        email: user.email,
        password: "123456",
        ip_address: "127.0.0.1",
        user_agent: "mozila-firefox 5.0",
        type: "OTP",
      })
    ).rejects.toBeInstanceOf(WrongCredentialsError);
  });

  it("should not be able to authenticate an unverified user", async () => {
    const password = "12345678";
    const hashedPassword = await fakeHasher.hash("12345678");

    const user = UserFactory.create({
      password: hashedPassword,
    });

    await inMemoryUsersRepository.save(user);

    if (user.password) {
      await expect(() =>
        sut.execute({
          email: user.email,
          password,
          ip_address: "127.0.0.1",
          user_agent: "mozila-firefox 5.0",
          type: "BASIC",
        })
      ).rejects.toBeInstanceOf(UserNotVerifiedError);
    }
  });

  it("should not be able to authenticate via basic auth if password is not setted", async () => {
    const user = UserFactory.create({
      verified: true,
    });

    await inMemoryUsersRepository.save(user);

    await expect(() =>
      sut.execute({
        email: user.email,
        password: "wrong",
        ip_address: "ip_address",
        user_agent: "mozila-firefox 5.0",
        type: "OTP",
      })
    ).rejects.toBeInstanceOf(PasswordNotSettedError);
  });
});
