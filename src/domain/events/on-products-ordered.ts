import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { DomainEvent } from "@/core/events/domain-event";
import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { Order } from "../entities/order";
import { CreateTransactionUseCase } from "../use-cases/create-transaction";

export class ProductsOrderedEvent implements DomainEvent {
  public order: Order;
  public ocurredAt: Date;

  constructor(order: Order) {
    this.ocurredAt = new Date();
    this.order = order;
  }

  getAggregateId(): UniqueEntityID {
    return this.order.id;
  }
}

export class OnProductsOrdered implements EventHandler {
  constructor(private createTransactionUseCase: CreateTransactionUseCase) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.createTransactionDinamicQrCode.bind(this),
      ProductsOrderedEvent.name
    );
  }

  public async createTransactionDinamicQrCode({ order }: ProductsOrderedEvent) {
    await this.createTransactionUseCase.execute({});
  }
}
