import { Cycle } from "../../entities/cycle";
import { CyclesRepository } from "../../repositories/cycles-repository";
import { InvalidCycleError } from "../errors/invalid-cycle-error";
import { ResourceAlreadyExistsError } from "../errors/resource-already-exists-error";

interface RegisterCycleUseCaseRequest {
  alias: string;
  offering: number[];
  ordering: number[];
  dispatching: number[];
  duration: number;
}

export class RegisterCycleUseCase {
  constructor(private cyclesRepository: CyclesRepository) {}

  async execute({
    alias,
    offering,
    ordering,
    dispatching,
    duration,
  }: RegisterCycleUseCaseRequest) {
    const cycleWithSameAlias = await this.cyclesRepository.findByAlias(alias);

    if (cycleWithSameAlias) {
      throw new ResourceAlreadyExistsError("Apelido", alias);
    }

    this.check(offering, duration, "ofertar");
    this.check(ordering, duration, "pedir");
    this.check(dispatching, duration, "enviar");

    const cycle = Cycle.create({
      alias,
      offering,
      ordering,
      dispatching,
      duration,
    });

    await this.cyclesRepository.save(cycle);
  }

  private check(days: number[], duration: number, action: string) {
    const hasDayGreaterThanCycle = days.find((day) => day > duration);

    if (hasDayGreaterThanCycle) {
      throw new InvalidCycleError(action);
    }
  }
}
