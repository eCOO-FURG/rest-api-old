import { FakePaymentsProcessor } from "test/payments/fake-payment-processor";
import { OnUserVerified } from "./on-user-verified";
import { VerifyUseCase } from "../use-cases/verify";
import { waitFor } from "test/utils/wait-for";
import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { InMemoryPeopleRepository } from "test/repositories/in-memory-people-repository";
import { SpyInstance } from "vitest";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { Account } from "../entities/account";
import { Person } from "../entities/person";
import { Cpf } from "../entities/value-objects/cpf";
import { Cellphone } from "../entities/value-objects/cellphone";

let inMemoryAccountsRepository: InMemoryAccountsRepository;
let fakePaymentsProcessor: FakePaymentsProcessor;
let fakePaymentsProcessorSpy: SpyInstance;
let inMemoryPeopleRepository: InMemoryPeopleRepository;
let fakeEncrypter: FakeEncrypter;
let verifiyUseCase: VerifyUseCase;

describe("on user verified", () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository();
    inMemoryPeopleRepository = new InMemoryPeopleRepository();
    fakeEncrypter = new FakeEncrypter();
    verifiyUseCase = new VerifyUseCase(
      inMemoryAccountsRepository,
      fakeEncrypter
    );

    fakePaymentsProcessor = new FakePaymentsProcessor();
    fakePaymentsProcessorSpy = vi.spyOn(
      fakePaymentsProcessor,
      "registerCustomer"
    );

    new OnUserVerified(inMemoryPeopleRepository, fakePaymentsProcessor);
  });

  it("should register a new customer on payments processor gateway when a user is verified", async () => {
    const account = Account.create({
      email: "johndoe@example.com",
      password: "123456",
      cellphone: Cellphone.createFromText("51987654321"),
    });

    inMemoryAccountsRepository.save(account);

    const person = Person.create({
      account_id: account.id,
      cpf: Cpf.createFromText("523.065.281-01"),
      first_name: "test",
      last_name: "test",
    });

    inMemoryPeopleRepository.save(person);

    await verifiyUseCase.execute({
      code: await fakeEncrypter.encrypt({ account_id: account.id.toString() }),
    });

    await waitFor(() => {
      expect(fakePaymentsProcessorSpy).toHaveBeenCalled();
    });
  });
});
