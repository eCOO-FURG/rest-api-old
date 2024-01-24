import { DomainEvent } from "@/core/events/domain-event";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { Order } from "../entities/order";

export class ProductsOrderedEvent implements DomainEvent {
  public ocurredAt: Date;

  constructor(order: Order) {
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return 1 as any;
  }
}
