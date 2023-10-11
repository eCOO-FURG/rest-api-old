import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { VerifyUseCase } from "./verify";
import { Account } from "../entities/account";
import { AccountAlreadyVerified } from "./errors/account-already-verified-error";

let inMemoryAccountsRepository: InMemoryAccountsRepository;
let fakeEncrypter: FakeEncrypter;
let sut: VerifyUseCase;

describe("verify", () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository();
    fakeEncrypter = new FakeEncrypter();
    sut = new VerifyUseCase(inMemoryAccountsRepository, fakeEncrypter);
  });

  it("should be able to verify an account", async () => {
    const account = Account.create({
      email: "johndoe@example.com",
      password: "123456",
    });

    inMemoryAccountsRepository.save(account);

    await sut.execute({
      code: await fakeEncrypter.encrypt({ account_id: account.id.toString() }),
    });

    expect(inMemoryAccountsRepository.items[0].verified_at).toBeInstanceOf(
      Date
    );
  });

  it("should not be able to verify an account twice", async () => {
    const account = Account.create({
      email: "johndoe@example.com",
      password: "123456",
    });

    inMemoryAccountsRepository.save(account);

    await sut.execute({
      code: await fakeEncrypter.encrypt({ account_id: account.id.toString() }),
    });

    await expect(async () =>
      sut.execute({
        code: await fakeEncrypter.encrypt({
          account_id: account.id.toString(),
        }),
      })
    ).rejects.toBeInstanceOf(AccountAlreadyVerified);
  });
});
