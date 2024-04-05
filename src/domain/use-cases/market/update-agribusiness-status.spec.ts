import { InMemoryAgribusinessesRepository } from "test/repositories/in-memory-agribusinesses-repository";
import { UpdateAgribusinessStatusUseCase } from "./update-agribusiness-status";
import { Agribusiness } from "../../entities/agribusiness";
import { UUID } from "@/core/entities/uuid";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryAgribusinessesRepository: InMemoryAgribusinessesRepository;
let sut: UpdateAgribusinessStatusUseCase;

describe("update", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryAgribusinessesRepository = new InMemoryAgribusinessesRepository(
      inMemoryUsersRepository
    );
    sut = new UpdateAgribusinessStatusUseCase(inMemoryAgribusinessesRepository);
  });
  it("should be able to update the status of an existing agribusiness", async () => {
    const agribusiness = Agribusiness.create({
      admin_id: new UUID("fake-id"),
      caf: "123456",
      name: "fake-agribusiness",
      active: true,
    });

    inMemoryAgribusinessesRepository.save(agribusiness);

    await sut.execute({
      agribusiness_id: agribusiness.id.value,
    });

    expect(inMemoryAgribusinessesRepository.items[0].active).toBe(false);
  });

  it("should not be able to update the status of an non existent agribusiness", async () => {
    await expect(async () => {
      await sut.execute({
        agribusiness_id: "random-id",
      });
    }).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
