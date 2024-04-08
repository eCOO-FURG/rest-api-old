import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { CyclesRepository } from "../../repositories/cycles-repository";
import { OrdersRepository } from "../../repositories/orders-repository";
import { Order } from "@/domain/entities/order";

interface ListCyclesUseCaseRequest {
  cycle_id: string;
  page: number;
  status: Order["status"];
}

export class ListOrdersUseCase {
  constructor(
    private cyclesRepository: CyclesRepository,
    private ordersRepository: OrdersRepository
  ) {}

  async execute({ cycle_id, page, status }: ListCyclesUseCaseRequest) {
    const cycle = await this.cyclesRepository.findById(cycle_id);

    if (!cycle) {
      throw new ResourceNotFoundError("Ciclo", cycle_id);
    }

    const orders = await this.ordersRepository.findManyByCycleIdPageAndStatus(
      cycle_id,
      page,
      status
    );

    return {
      orders,
    };
  }
}
