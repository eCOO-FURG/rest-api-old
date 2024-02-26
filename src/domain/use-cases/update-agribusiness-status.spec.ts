import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { InMemoryAgribusinessesRepository } from "test/repositories/in-memory-agribusinesses-repository";
import { UpdateAgribusinessStatusUseCase } from "./update-agribusiness-status";
import { Account } from "../entities/account";
import { Agribusiness } from "../entities/agribusiness";
import { Cellphone } from "../entities/value-objects/cellphone";

let inMemoryAccountsRepository: InMemoryAccountsRepository;
let inMemoryAgribusinessesRepository: InMemoryAgribusinessesRepository;
let sut: UpdateAgribusinessStatusUseCase;

describe("update", () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository();
    inMemoryAgribusinessesRepository = new InMemoryAgribusinessesRepository();
    sut = new UpdateAgribusinessStatusUseCase(inMemoryAgribusinessesRepository);
  });
  it("should be able to update the status of an existing agribusiness", async () => {
    const account = Account.create({
      email: "johndoe@example.com",
      password: "123456",
      verified_at: new Date(),
      cellphone: Cellphone.createFromText("519876543"),
    });

    inMemoryAccountsRepository.save(account);

    const agribusiness = Agribusiness.create({
      admin_id: account.id,
      caf: "123456",
      name: "fake-agribusiness",
      active: true,
    });

    inMemoryAgribusinessesRepository.save(agribusiness);

    await sut.execute({
      agribusiness_id: agribusiness.id.toString(),
    });

    expect(inMemoryAgribusinessesRepository.items[0].active).toBe(false);
  });
});
