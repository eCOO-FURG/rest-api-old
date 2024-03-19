import { InMemoryCyclesRepository } from "test/repositories/in-memory-cycles-repository";
import { Cycle } from "../../entities/cycle";
import { InvalidDayForCycleActionError } from "../errors/invalid-day-for-cycle-action-error";
import { ValidateCycleActionUseCase } from "./validate-cycle-action";

let inMemoryCyclesRepository: InMemoryCyclesRepository;
let sut: ValidateCycleActionUseCase;

describe("validat action day", () => {
  beforeEach(() => {
    inMemoryCyclesRepository = new InMemoryCyclesRepository();
    sut = new ValidateCycleActionUseCase(inMemoryCyclesRepository);
  });

  it("should be able to validate if an cycle action is allowed on the current day", async () => {
    const cycle = Cycle.create({
      alias: "Testing cycle",
      offering: [1, 2, 3, 4, 5, 6, 7],
      ordering: [1, 2, 3, 4, 5, 6, 7],
      dispatching: [1, 2, 3, 4, 5, 6, 7],
      duration: 7,
    });

    await inMemoryCyclesRepository.save(cycle);

    await sut.execute({ cycle_id: cycle.id.value, action: "offering" });
  });

  it("should not be allowed to proceed if not on a valid day for the action", async () => {
    const cycle = Cycle.create({
      alias: "Testing cycle",
      offering: [],
      ordering: [3, 4, 5],
      dispatching: [5, 6],
      duration: 7,
    });

    await inMemoryCyclesRepository.save(cycle);

    await expect(() =>
      sut.execute({ cycle_id: cycle.id.value, action: "offering" })
    ).rejects.toBeInstanceOf(InvalidDayForCycleActionError);
  });
});
