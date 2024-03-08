import { InMemoryAgribusinessesRepository } from "test/repositories/in-memory-agribusinesses-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { RegisterAgribusinessUseCase } from "./register-agribusiness";
import { SingleAgribusinessListingUseCase } from "./single-agribusiness-listing";
import { User } from "../entities/user";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryAgribusinessesRepository: InMemoryAgribusinessesRepository;
let registerAgribusinessUseCase: RegisterAgribusinessUseCase;
let sut: SingleAgribusinessListingUseCase;

describe("single agribusiness listing", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryAgribusinessesRepository = new InMemoryAgribusinessesRepository();
    registerAgribusinessUseCase = new RegisterAgribusinessUseCase(
      inMemoryUsersRepository,
      inMemoryAgribusinessesRepository
    );
    sut = new SingleAgribusinessListingUseCase(
      inMemoryAgribusinessesRepository
    );
  });

  it("should be able to list an agribusinesses", async () => {
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

    const agribusinessResult = await registerAgribusinessUseCase.execute({
      user_id: user.id.value,
      caf: "123456",
      name: "fake-agribusiness",
    });

    await sut.execute({
      agribusiness_id: agribusinessResult.agribusiness.id.value,
    });
    expect(inMemoryAgribusinessesRepository.items[0].name).toBe(
      "fake-agribusiness"
    );
  });

  it("should not be able to show an agribusiness because id is invalid", async () => {
    await expect(async () => {
      await sut.execute({
        agribusiness_id: "ahhahahha",
      });
    }).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
