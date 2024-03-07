import { InMemoryAgribusinessesRepository } from "test/repositories/in-memory-agribusinesses-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { AgribusinessListingUseCase } from "./agribusiness-listing";
import { Agribusiness } from "../entities/agribusiness";
import { User } from "../entities/user";
import { RegisterAgribusinessUseCase } from "./register-agribusiness";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryAgribusinessesRepository: InMemoryAgribusinessesRepository;
let registerAgribusinessUseCase: RegisterAgribusinessUseCase;
let sut: AgribusinessListingUseCase;

describe("agribusiness listing", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryAgribusinessesRepository = new InMemoryAgribusinessesRepository();
    registerAgribusinessUseCase = new RegisterAgribusinessUseCase(
      inMemoryUsersRepository,
      inMemoryAgribusinessesRepository
    );
    sut = new AgribusinessListingUseCase(inMemoryAgribusinessesRepository);
  });

  it("should be able to list 1 agribusinesses", async () => {
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

    const agribusiness1 = await registerAgribusinessUseCase.execute({
      user_id: user1.id.value,
      caf: "123456",
      name: "fake-agribusiness",
    });

    const agribusinessList = await sut.execute({ page: 1 });

    expect(agribusinessList).toHaveLength(1);
  });

  it("should be able to list an array with 2 agribusiness, in alphabetical order", async () => {
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

    const agribusiness1 = await registerAgribusinessUseCase.execute({
      user_id: user1.id.value,
      caf: "123456",
      name: "fake-agribusiness",
    });

    const user2 = User.create({
      email: "eduardo@example.com",
      phone: "51999030150",
      password: "12345678",
      first_name: "Eduardo",
      last_name: "Corrêa",
      cpf: "803.579.167-27",
      verified_at: new Date(),
    });

    await inMemoryUsersRepository.save(user2);

    const agribusiness2 = await registerAgribusinessUseCase.execute({
      user_id: user2.id.value,
      caf: "555555",
      name: "Agronegócio do Eduardo",
    });

    const agribusinessList = await sut.execute({ page: 1 });

    expect(agribusinessList).toHaveLength(2);
    expect(agribusinessList[0].name).toBe("Agronegócio do Eduardo");
  });

  it("should be able to list an empty array of agribusinesses", async () => {
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

    const agribusiness1 = await registerAgribusinessUseCase.execute({
      user_id: user1.id.value,
      caf: "123456",
      name: "fake-agribusiness",
    });

    const agribusinessList = await sut.execute({ page: 2 });

    expect(agribusinessList).toHaveLength(0);
  });
});
