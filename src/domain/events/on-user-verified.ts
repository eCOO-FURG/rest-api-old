import { DomainEvent } from "@/core/events/domain-event";
import { EventHandler } from "@/core/events/event-handler";
import { PaymentsProcessor } from "../payments/payments-processor";
import { DomainEvents } from "@/core/events/domain-events";
import { User } from "../entities/user";
import { UUID } from "@/core/entities/uuid";

export class UserVerifiedEvent implements DomainEvent {
  public ocurred_at: Date;
  public user: User;

  constructor(user: User) {
    this.ocurred_at = new Date();
    this.user = user;
  }

  getEntityId(): UUID {
    return this.user.id;
  }
}

export class OnUserVerified implements EventHandler {
  constructor(private paymentsProcessor: PaymentsProcessor) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.registerCustomerOnPaymentProcessor.bind(this),
      UserVerifiedEvent.name
    );
  }

  public async registerCustomerOnPaymentProcessor({ user }: UserVerifiedEvent) {
    await this.paymentsProcessor.register(user);
  }
}
