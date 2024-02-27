import { UpdateAgribusinessUseCase } from "./update-agribusiness";
import { Account } from "../entities/account";
import { InMemoryAgribusinessesRepository } from "test/repositories/in-memory-agribusinesses-repository";
import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { Cellphone } from "../entities/value-objects/cellphone";
import { Agribusiness } from "../entities/agribusiness";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists-error";

let inMemoryAccountsRepository: InMemoryAccountsRepository;
let inMemoryAgribusinessesRepository: InMemoryAgribusinessesRepository;
let sut: UpdateAgribusinessUseCase;

describe("update", () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository();
    inMemoryAgribusinessesRepository = new InMemoryAgribusinessesRepository();
    sut = new UpdateAgribusinessUseCase(inMemoryAgribusinessesRepository);
  });

  it("should be able to update the name of an existing agribusiness", async () => {
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
      name: "Agronegócio do Eduardo",
      caf: "123456",
    });

    expect(inMemoryAgribusinessesRepository.items[0].name).toBe(
      "Agronegócio do Eduardo"
    );
  });

  it("should not be able to update an agribusiness with a caf that already exists", async () => {
    const account1 = Account.create({
      email: "johndoe@example.com",
      password: "123456",
      verified_at: new Date(),
      cellphone: Cellphone.createFromText("519876543"),
    });

    const account2 = Account.create({
      email: "janedoe@example.com",
      password: "abcdef",
      verified_at: new Date(),
      cellphone: Cellphone.createFromText("519876544"),
    });

    inMemoryAccountsRepository.save(account1);
    inMemoryAccountsRepository.save(account2);

    const agribusiness1 = Agribusiness.create({
      admin_id: account1.id,
      caf: "123456",
      name: "fake-agribusiness-1",
      active: true,
    });

    const agribusiness2 = Agribusiness.create({
      admin_id: account2.id,
      caf: "789012",
      name: "fake-agribusiness-2",
      active: true,
    });

    inMemoryAgribusinessesRepository.save(agribusiness1);
    inMemoryAgribusinessesRepository.save(agribusiness2);

    await expect(
      sut.execute({
        agribusiness_id: agribusiness2.id.toString(),
        name: "Agronegócio do Timóteo",
        caf: "123456",
      })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });
});
