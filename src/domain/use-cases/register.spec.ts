import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { RegisterUseCase } from "./register";
import { Account } from "../entities/account";
import { InMemoryPeopleRepository } from "test/repositories/in-memory-people-repository";
import { Person } from "../entities/person";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { ResourceAlreadyExistsError } from "../../core/errors/resource-already-exists-error";

let inMemoryAccountsRepository: InMemoryAccountsRepository;
let inMemoryPeopleRepository: InMemoryPeopleRepository;
let fakeHasher: FakeHasher;
let sut: RegisterUseCase;

describe("register", () => {
  beforeEach(() => {
    inMemoryAccountsRepository = new InMemoryAccountsRepository();
    inMemoryPeopleRepository = new InMemoryPeopleRepository();
    fakeHasher = new FakeHasher();
    sut = new RegisterUseCase(
      inMemoryAccountsRepository,
      inMemoryPeopleRepository,
      fakeHasher
    );
  });

  it("should be able to able to register", async () => {
    await sut.execute({
      email: "johndoe@example.com",
      cellphone: "51987654321",
      password: "123456",
      first_name: "John",
      last_name: "Doe",
      cpf: "523.065.281-01",
    });

    expect(inMemoryAccountsRepository.items[0]).toBeInstanceOf(Account);
    expect(inMemoryPeopleRepository.items[0]).toBeInstanceOf(Person);
  });

  it("should not be able to register with the same email twice", async () => {
    const email = "johndoe@example.com";

    await sut.execute({
      email,
      cellphone: "51987654321",
      password: "123456",
      first_name: "John",
      last_name: "Doe",
      cpf: "523.065.281-01",
    });

    await expect(() =>
      sut.execute({
        email,
        cellphone: "51987654321",
        password: "123456",
        first_name: "Rodrigo",
        last_name: "Goes",
        cpf: "523.065.281-02",
      })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should not be able to register with the same cellphone twice", async () => {
    const cellphone = "51987654321";

    await sut.execute({
      email: "johndoe@example.com",
      cellphone,
      password: "123456",
      first_name: "John",
      last_name: "Doe",
      cpf: "523.065.281-01",
    });

    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        cellphone,
        password: "123456",
        first_name: "Rodrigo",
        last_name: "Goes",
        cpf: "523.065.281-02",
      })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should not be able to register with the same CPF twice", async () => {
    const cpf = "523.065.281-01";

    await sut.execute({
      email: "johndoe@example.com",
      cellphone: "51987654321",
      password: "123456",
      first_name: "John",
      last_name: "Doe",
      cpf,
    });

    await expect(() =>
      sut.execute({
        email: "rodrigogoes@example.com",
        cellphone: "51987654321",
        password: "123456",
        first_name: "Rodrigo",
        last_name: "Goes",
        cpf,
      })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should hash the password", async () => {
    const password = "123456";

    await sut.execute({
      email: "johndoe@example.com",
      cellphone: "51987654321",
      password,
      first_name: "John",
      last_name: "Doe",
      cpf: "523.065.281-01",
    });

    expect(inMemoryAccountsRepository.items[0].password === password).toBeFalsy;
  });
});
