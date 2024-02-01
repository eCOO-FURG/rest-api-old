import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { InMemoryPeopleRepository } from "test/repositories/in-memory-people-repository";
import { GetUserProfileUseCase } from "./get-user-profile";
import { Account } from "../entities/account";
import { Person } from "../entities/person";
import { Cpf } from "../entities/value-objects/cpf";
import { Cellphone } from "../entities/value-objects/cellphone";

let inMemoryAccountsRepository: InMemoryAccountsRepository;
let inMemoryPeopleRepository: InMemoryPeopleRepository;
let sut: GetUserProfileUseCase;

describe("get user profile", () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository();
    inMemoryPeopleRepository = new InMemoryPeopleRepository();
    sut = new GetUserProfileUseCase(
      inMemoryAccountsRepository,
      inMemoryPeopleRepository
    );
  });

  it("should be able to get a user by account id", async () => {
    const account = Account.create({
      email: "johndoe@example.com",
      password: "123456",
      cellphone: Cellphone.createFromText("519876543"),
    });

    inMemoryAccountsRepository.save(account);

    const person = Person.create({
      first_name: "John",
      last_name: "Doe",
      cpf: Cpf.createFromText("523.065.281-01"),
      account_id: account.id,
    });

    inMemoryPeopleRepository.save(person);

    const result = await sut.execute({
      account_id: account.id.toString(),
    });

    expect(result).toEqual(
      expect.objectContaining({
        account,
        person,
      })
    );
  });
});
