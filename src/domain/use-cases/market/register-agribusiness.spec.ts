import { InMemoryAgribusinessesRepository } from "test/repositories/in-memory-agribusinesses-repository";
import { RegisterAgribusinessUseCase } from "./register-agribusiness";
import { Agribusiness } from "../../entities/agribusiness";
import { AlreadyAgribusinessAdminError } from "../errors/already-agribusiness-admin-error";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { User } from "../../entities/user";
import { ResourceAlreadyExistsError } from "../errors/resource-already-exists-error";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryAgribusinessesRepository: InMemoryAgribusinessesRepository;
let sut: RegisterAgribusinessUseCase;

describe("create agribusiness", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryAgribusinessesRepository = new InMemoryAgribusinessesRepository(
      inMemoryUsersRepository
    );
    sut = new RegisterAgribusinessUseCase(
      inMemoryUsersRepository,
      inMemoryAgribusinessesRepository
    );
  });

  it("should be able to create a agribusiness", async () => {
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

    await sut.execute({
      user_id: user.id.value,
      caf: "123456",
      name: "fake-agribusiness",
    });

    expect(inMemoryAgribusinessesRepository.items[0]).toBeInstanceOf(
      Agribusiness
    );
  });

  it("should not be able to create two agribusiness with the same caf", async () => {
    const user1 = User.create({
      email: "johndoe@example.com",
      phone: "51987654321",
      password: "12345678",
      first_name: "John",
      last_name: "Doe",
      cpf: "523.065.281-01",
      verified_at: new Date(),
    });

    await inMemoryUsersRepository.save(user1);

    const user2 = User.create({
      email: "johndoe@example.com",
      phone: "51987654321",
      password: "12345678",
      first_name: "John",
      last_name: "Doe",
      cpf: "523.065.281-01",
      verified_at: new Date(),
    });

    await inMemoryUsersRepository.save(user2);

    const caf = "12345678";

    const agribusiness = Agribusiness.create({
      admin_id: user1.id,
      caf,
      name: "agronegocio-1",
    });

    await inMemoryAgribusinessesRepository.save(agribusiness);

    await expect(() =>
      sut.execute({
        user_id: user2.id.value,
        caf,
        name: "agronegocio-2",
      })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it("should not be able to create an agribusiness with an admin who is already an admin of another agribusiness", async () => {
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

    const agribusiness = Agribusiness.create({
      admin_id: user.id,
      caf: "12345678",
      name: "agronegocio-1",
    });

    await inMemoryAgribusinessesRepository.save(agribusiness);

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        caf: "777777",
        name: "second agribusiness but with same admin",
      })
    ).rejects.toBeInstanceOf(AlreadyAgribusinessAdminError);
  });

  it("should set the admin user as a producer", async () => {
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

    await sut.execute({
      user_id: user.id.value,
      caf: "123456",
      name: "fake-agribusiness",
    });

    expect(inMemoryUsersRepository.items[0].roles).toContain("PRODUCER");
  });
});
