import { InMemoryCyclesRepository } from "test/repositories/in-memory-cycles-repository";
import { RegisterCycleUseCase } from "./register-cycle";
import { Cycle } from "../entities/cycle";
import { InvalidCycleError } from "./errors/invalid-cycle-error";
import { ResourceAlreadyExistsError } from "./errors/resource-already-exists-error";

let inMemoryCyclesRepository: InMemoryCyclesRepository;
let sut: RegisterCycleUseCase;

describe("register cycle", () => {
  beforeEach(() => {
    inMemoryCyclesRepository = new InMemoryCyclesRepository();
    sut = new RegisterCycleUseCase(inMemoryCyclesRepository);
  });

  it("should be able to register a cycle", async () => {
    await sut.execute({
      alias: "Testing cycle",
      offering: [1, 2, 3],
      ordering: [3, 4, 5],
      dispatching: [5, 6],
      duration: 7,
    });

    expect(inMemoryCyclesRepository.items[0]).toBeInstanceOf(Cycle);
  });

  it("should not be able to register cycle actions to a day outside the cycle duration", async () => {
    await expect(async () => {
      await sut.execute({
        alias: "Testing cycle",
        offering: [1, 2, 3],
        ordering: [3, 4, 8],
        dispatching: [5, 6],
        duration: 7,
      });
    }).rejects.toBeInstanceOf(InvalidCycleError);
  });

  it("should not be able to register a cycle that already exists", async () => {
    const cycle = Cycle.create({
      alias: "Testing cycle",
      offering: [1, 2, 3],
      ordering: [3, 4, 5],
      dispatching: [5, 6],
      duration: 7,
    });

    await inMemoryCyclesRepository.save(cycle);

    await expect(async () => {
      await sut.execute({
        alias: "Testing cycle",
        offering: [1, 2, 3],
        ordering: [3, 4, 8],
        dispatching: [5, 6],
        duration: 7,
      });
    }).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });
});
