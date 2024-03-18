import { InMemoryCyclesRepository } from "test/repositories/in-memory-cycles-repository";
import { ListCycleUseCase } from "./list-cycles";
import { Cycle } from "../../entities/cycle";

let inMemoryCyclesRepository: InMemoryCyclesRepository;
let sut: ListCycleUseCase;

describe("list cycles", () => {
  beforeEach(() => {
    inMemoryCyclesRepository = new InMemoryCyclesRepository();
    sut = new ListCycleUseCase(inMemoryCyclesRepository);
  });

  it("should be able to list all cycles", async () => {
    const cycle = Cycle.create({
      alias: "Testing cycle",
      offering: [1, 2, 3],
      ordering: [3, 4, 5],
      dispatching: [5, 6],
      duration: 7,
    });

    await inMemoryCyclesRepository.save(cycle);

    const result = await sut.execute();

    expect(result.cycles).toHaveLength(1);
  });
});
