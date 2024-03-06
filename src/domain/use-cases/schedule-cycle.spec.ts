import { InMemorySchedulesRepository } from "test/repositories/in-memory-schedules-repository";
import { ScheduleCycleUseCase } from "./schedule-cycle";
import { InMemoryCyclesRepository } from "test/repositories/in-memory-cycles-repository";
import { Cycle } from "../entities/cycle";
import { Schedule } from "../entities/schedule";
import { ScheduleConflictError } from "./errors/schedule-conflict-error";
import { InvalidScheduleDate } from "./errors/invalid-schedule-date";

let inMemoryCyclesRepository: InMemoryCyclesRepository;
let inMemorySchedulesRepository: InMemorySchedulesRepository;
let sut: ScheduleCycleUseCase;

describe("schedule cycle", () => {
  beforeEach(() => {
    inMemoryCyclesRepository = new InMemoryCyclesRepository();
    inMemorySchedulesRepository = new InMemorySchedulesRepository(
      inMemoryCyclesRepository
    );
    sut = new ScheduleCycleUseCase(
      inMemoryCyclesRepository,
      inMemorySchedulesRepository
    );
  });

  it("should be able to schedule a cycle", async () => {
    const cycle = Cycle.create({
      alias: "Testing cycle",
      offering: [1, 2, 3],
      ordering: [3, 4, 5],
      dispatching: [5, 6],
      duration: 7,
    });

    await inMemoryCyclesRepository.save(cycle);

    await sut.execute({
      cycle_id: cycle.id.value,
      start_at: new Date(),
    });

    expect(inMemorySchedulesRepository.items[0]).toBeInstanceOf(Schedule);
  });

  it("should not be able schedule a cycle in an already scheduled period", async () => {
    const cycle = Cycle.create({
      alias: "Testing cycle",
      offering: [1, 2, 3],
      ordering: [3, 4, 5],
      dispatching: [5, 6],
      duration: 7,
    });

    await inMemoryCyclesRepository.save(cycle);

    const now = new Date();
    const days = 7;
    const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const schedule = Schedule.create({
      cycle_id: cycle.id,
      start_at: now,
    });

    await inMemorySchedulesRepository.save(schedule);

    await expect(() =>
      sut.execute({
        cycle_id: cycle.id.value,
        start_at: future,
      })
    ).rejects.toBeInstanceOf(ScheduleConflictError);
  });

  it("should not be able schedule a cycle in the past", async () => {
    const now = new Date();
    const seconds = 1;
    const past = new Date(now.getTime() - seconds * 1000);

    await expect(() =>
      sut.execute({
        cycle_id: "cycle-id",
        start_at: past,
      })
    ).rejects.toBeInstanceOf(InvalidScheduleDate);
  });
});
