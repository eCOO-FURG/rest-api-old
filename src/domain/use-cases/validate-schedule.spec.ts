import { InMemorySchedulesRepository } from "test/repositories/in-memory-schedules-repository";
import { Cycle } from "../entities/cycle";
import { Schedule } from "../entities/schedule";
import { ValidateScheduleUseCase } from "./validate-schedule";
import { InvalidDayForCycleActionError } from "./errors/invalid-day-for-cycle-action-error";

let inMemorySchedulesRepository: InMemorySchedulesRepository;
let sut: ValidateScheduleUseCase;

describe("validat action day", () => {
  beforeEach(() => {
    inMemorySchedulesRepository = new InMemorySchedulesRepository();
    sut = new ValidateScheduleUseCase(inMemorySchedulesRepository);
  });

  it("should be able to validate if an cycle action is allowed on the current day", async () => {
    const cycle = Cycle.create({
      alias: "Testing cycle",
      offering: [1, 2, 3],
      ordering: [3, 4, 5],
      dispatching: [5, 6],
      duration: 7,
    });

    const schedule = Schedule.create({
      start_at: new Date(),
      cycle,
    });

    await inMemorySchedulesRepository.save(schedule);

    await sut.execute({ action: "offering" });
  });

  it("should not be allowed to proceed if not on a valid day for the action", async () => {
    const cycle = Cycle.create({
      alias: "Testing cycle",
      offering: [2, 3],
      ordering: [3, 4, 5],
      dispatching: [5, 6],
      duration: 7,
    });

    const schedule = Schedule.create({
      start_at: new Date(),
      cycle,
    });

    await inMemorySchedulesRepository.save(schedule);

    await expect(() =>
      sut.execute({ action: "offering" })
    ).rejects.toBeInstanceOf(InvalidDayForCycleActionError);
  });
});
