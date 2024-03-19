import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { CyclesRepository } from "../../repositories/cycles-repository";
import { InvalidDayForCycleActionError } from "../errors/invalid-day-for-cycle-action-error";

interface ValidateScheduleUseCaseRequest {
  cycle_id: string;
  action: "offering" | "ordering" | "dispatching";
}

const mapper = {
  offering: "ofertar",
  ordering: "pedir",
  dispatching: "enviar",
};

export class ValidateCycleActionUseCase {
  constructor(private cyclesRepository: CyclesRepository) {}

  async execute({ cycle_id, action }: ValidateScheduleUseCaseRequest) {
    const cycle = await this.cyclesRepository.findById(cycle_id);

    if (!cycle) {
      throw new ResourceNotFoundError("Ciclo", cycle_id);
    }

    const today = new Date().getDay() + 1;

    const allowed = cycle[action].find((day) => today === day);

    if (!allowed) {
      throw new InvalidDayForCycleActionError(mapper[action], cycle.alias);
    }

    return {
      cycle,
    };
  }
}
