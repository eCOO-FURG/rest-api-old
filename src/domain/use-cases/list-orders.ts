import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { CyclesRepository } from "../repositories/cycles-repository";
import { OrdersRepository } from "../repositories/orders-repository";

interface ListCyclesUseCaseRequest {
  cycle_id: string;
  page: number;
}

export class ListOrdersUseCase {
  constructor(
    private cyclesRepository: CyclesRepository,
    private ordersRepository: OrdersRepository
  ) {}

  async execute({ cycle_id, page }: ListCyclesUseCaseRequest) {
    const cycle = await this.cyclesRepository.findById(cycle_id);

    if (!cycle) {
      throw new ResourceNotFoundError("Ciclo", cycle_id);
    }

    const orders = await this.ordersRepository.findManyByCycleIdAndPage(
      cycle_id,
      page
    );

    return {
      orders,
    };
  }
}
