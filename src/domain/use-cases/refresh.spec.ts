import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { InMemorySessionsRepository } from "test/repositories/in-memory-sessions-repository";
import { RefreshUseCase } from "./refresh";
import { Session } from "../entities/session";
import { SessionExpiredError } from "./errors/session-expired-error";
import { Cellphone } from "../entities/value-objects/cellphone";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { User } from "../entities/user";
import { UUID } from "@/core/entities/uuid";
import { env } from "@/infra/env";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemorySessionsRepository: InMemorySessionsRepository;
let fakeEncrypter: FakeEncrypter;
let sut: RefreshUseCase;

describe("refresh", () => {
  inMemoryUsersRepository = new InMemoryUsersRepository();
  inMemorySessionsRepository = new InMemorySessionsRepository();
  fakeEncrypter = new FakeEncrypter();
  sut = new RefreshUseCase(
    inMemoryUsersRepository,
    inMemorySessionsRepository,
    fakeEncrypter
  );

  it("should be able to refresh an active session", async () => {
    const user = User.create({
      email: "johndoe@example.com",
      phone: "51987654321",
      password: "12345678",
      first_name: "John",
      last_name: "Doe",
      cpf: "523.065.281-01",
      verified_at: new Date(),
    });

    await inMemoryUsersRepository.save(user);

    const session = Session.create({
      ip_address: "8.8.8.8",
      user_agent: "mozila-firefox 5.0",
      user_id: user.id,
    });

    inMemorySessionsRepository.save(session);

    const access_token = await fakeEncrypter.encrypt({
      user_id: user.id.value,
    });

    const result = await sut.execute({
      access_token,
      user_agent: "mozila-firefox 5.0",
      ip_address: "8.8.8.8",
    });

    expectTypeOf(result).toMatchTypeOf<{ user_id: string }>;
  });

  it("should not be able to refresh an expired session", async () => {
    const user = User.create({
      email: "johndoe@example.com",
      phone: "51987654321",
      password: "12345678",
      first_name: "John",
      last_name: "Doe",
      cpf: "523.065.281-01",
      verified_at: new Date(),
    });

    await inMemoryUsersRepository.save(user);

    const expirationDate = new Date(
      Date.now() - env.SESSION_DURATION_IN_DAYS * 24 * 60 * 60 * 1000
    );

    const session = Session.create({
      user_id: user.id,
      ip_address: "127.0.0.1",
      user_agent: "mozila-firefox 5.0",
      created_at: expirationDate,
    });

    inMemorySessionsRepository.save(session);

    const access_token = await fakeEncrypter.encrypt({
      user_id: user.id.value,
    });

    await expect(() =>
      sut.execute({
        access_token,
        user_agent: "mozila-firefox 5.0",
        ip_address: "127.0.0.0",
      })
    ).rejects.toBeInstanceOf(SessionExpiredError);
  });
});
