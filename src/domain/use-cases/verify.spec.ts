import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { VerifyUseCase } from "./verify";
import { Account } from "../entities/account";
import { Cellphone } from "../entities/value-objects/cellphone";

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
      cellphone: Cellphone.createFromText("519876543"),
    });

    inMemoryAccountsRepository.save(account);

    await sut.execute({
      code: await fakeEncrypter.encrypt({ account_id: account.id.toString() }),
    });

    expect(inMemoryAccountsRepository.items[0].verified_at).toBeInstanceOf(
      Date
    );
  });

  it("should not be able to verify an account twice", async () => {});
});
