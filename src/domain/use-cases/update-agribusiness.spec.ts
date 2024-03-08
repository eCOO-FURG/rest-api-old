import { UpdateAgribusinessUseCase } from "./update-agribusiness";
import { InMemoryAgribusinessesRepository } from "test/repositories/in-memory-agribusinesses-repository";
import { Agribusiness } from "../entities/agribusiness";
import { UUID } from "@/core/entities/uuid";
import { ResourceAlreadyExistsError } from "./errors/resource-already-exists-error";

let inMemoryAgribusinessesRepository: InMemoryAgribusinessesRepository;
let sut: UpdateAgribusinessUseCase;

describe("update", () => {
  beforeEach(() => {
    inMemoryAgribusinessesRepository = new InMemoryAgribusinessesRepository();
    sut = new UpdateAgribusinessUseCase(inMemoryAgribusinessesRepository);
  });

  it("should be able to update the name of an existing agribusiness", async () => {
    const agribusiness = Agribusiness.create({
      admin_id: new UUID("fake-id"),
      caf: "123456",
      name: "fake-agribusiness",
      active: true,
    });

    inMemoryAgribusinessesRepository.save(agribusiness);

    await sut.execute({
      agribusiness_id: agribusiness.id.value,
      name: "Agronegócio do Eduardo",
      caf: "123456",
    });

    expect(inMemoryAgribusinessesRepository.items[0].name).toBe(
      "Agronegócio do Eduardo"
    );
  });

  it("should not be able to update an agribusiness with a caf that already exists", async () => {
    const agribusiness1 = Agribusiness.create({
      admin_id: new UUID("fake-id"),
      caf: "123456",
      name: "fake-agribusiness-1",
      active: true,
    });

    const agribusiness2 = Agribusiness.create({
      admin_id: new UUID("fake-id"),
      caf: "789012",
      name: "fake-agribusiness-2",
      active: true,
    });

    inMemoryAgribusinessesRepository.save(agribusiness1);
    inMemoryAgribusinessesRepository.save(agribusiness2);

    await expect(
      sut.execute({
        agribusiness_id: agribusiness2.id.value,
        name: "Agronegócio do Timóteo",
        caf: "123456",
      })
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });
});
