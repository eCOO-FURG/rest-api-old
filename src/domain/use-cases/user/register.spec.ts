import { RegisterUseCase } from "./register";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { ResourceAlreadyExistsError } from "../errors/resource-already-exists-error";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { User } from "../../entities/user";

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let sut: RegisterUseCase;

describe("register", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    sut = new RegisterUseCase(inMemoryUsersRepository, fakeHasher);
  });

  it("should be able to able to register", async () => {
    await sut.execute({
      email: "johndoe@example.com",
      phone: "51987654321",
      password: "123456",
      first_name: "John",
      last_name: "Doe",
      cpf: "523.065.281-01",
    });

    expect(inMemoryUsersRepository.items[0]).toBeInstanceOf(User);
  });

  it("should be able to able to register with an empty password", async () => {
    await sut.execute({
      email: "johndoe@example.com",
      phone: "51987654321",
      first_name: "John",
      last_name: "Doe",
      cpf: "523.065.281-01",
    });

    expect(inMemoryUsersRepository.items[0]).toBeInstanceOf(User);
    expect(inMemoryUsersRepository.items[0].password).toBeUndefined();
  });

  it("should not be able to register with the same email twice", async () => {
    const email = "johndoe@example.com";

    const user = User.create({
      email,
      phone: "51987654321",
      password: "123456",
      first_name: "John",
      last_name: "Doe",
      cpf: "523.065.281-01",
    });

    await inMemoryUsersRepository.save(user);

    await expect(() =>
      sut.execute({
        email,
        phone: "51987654321",
        password: "123456",
        first_name: "Rodrigo",
        last_name: "Goes",
        cpf: "523.065.281-02",
      })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should not be able to register with the same cellphone twice", async () => {
    const phone = "51987654321";

    const user = User.create({
      email: "johndoe@example.com",
      phone,
      password: "123456",
      first_name: "John",
      last_name: "Doe",
      cpf: "523.065.281-01",
    });

    await inMemoryUsersRepository.save(user);

    await expect(() =>
      sut.execute({
        email: "rodrigogoes@example.com",
        phone,
        password: "123456",
        first_name: "Rodrigo",
        last_name: "Goes",
        cpf: "523.065.281-02",
      })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should not be able to register with the same CPF twice", async () => {
    const cpf = "523.065.281-01";

    const user = User.create({
      email: "johndoe@example.com",
      phone: "51987654321",
      password: "123456",
      first_name: "John",
      last_name: "Doe",
      cpf,
    });

    await inMemoryUsersRepository.save(user);

    await expect(() =>
      sut.execute({
        email: "rodrigogoes@example.com",
        phone: "51cellphone987654321",
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
      phone: "51987654321",
      password,
      first_name: "John",
      last_name: "Doe",
      cpf: "523.065.281-01",
    });

    expect(inMemoryUsersRepository.items[0].password === password).toBeFalsy;
  });
});
