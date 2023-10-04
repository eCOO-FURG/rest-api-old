import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { InMemorySessionsRepository } from "test/repositories/in-memory-sessions-repository";
import { RefreshUseCase } from "./refresh";
import { Account } from "../entities/account";
import { Session } from "../entities/session";
import { SessionExpiredError } from "./errors/session-expired-error";

let inMemoryAccountsRepository: InMemoryAccountsRepository;
let inMemorySessionsRepository: InMemorySessionsRepository;
let fakeEncrypter: FakeEncrypter;
let sut: RefreshUseCase;

describe("refresh", () => {
  inMemoryAccountsRepository = new InMemoryAccountsRepository();
  inMemorySessionsRepository = new InMemorySessionsRepository();
  fakeEncrypter = new FakeEncrypter();
  sut = new RefreshUseCase(
    inMemoryAccountsRepository,
    inMemorySessionsRepository,
    fakeEncrypter
  );

  it("should be able to refresh an active session", async () => {
    const account = Account.create({
      email: "johndoe@example.com",
      password: "123456",
    });

    inMemoryAccountsRepository.save(account);

    const session = Session.create({
      account_id: account.id,
      ip_address: "127.0.0.1",
      status: "VALID",
    });

    inMemorySessionsRepository.save(session);

    const access_token = await fakeEncrypter.encrypt({
      sub: account.id.toString(),
    });

    const result = await sut.execute({
      access_token,
      ip_adress: "127.0.0.1",
    });

    expectTypeOf(result).toMatchTypeOf<{ sub: string }>;
  });

  it("should not be able to refresh an expired session", async () => {
    const account = Account.create({
      email: "johndoe@example.com",
      password: "123456",
    });

    inMemoryAccountsRepository.save(account);

    const session = Session.create({
      account_id: account.id,
      ip_address: "127.0.0.1",
      status: "EXPIRED",
    });

    inMemorySessionsRepository.save(session);

    const access_token = await fakeEncrypter.encrypt({
      sub: account.id.toString(),
    });

    await expect(() =>
      sut.execute({
        access_token,
        ip_adress: "127.0.0.1",
      })
    ).rejects.toBeInstanceOf(SessionExpiredError);
  });
});
