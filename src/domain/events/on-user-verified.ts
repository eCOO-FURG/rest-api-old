import { DomainEvent } from "@/core/events/domain-event";
import { EventHandler } from "@/core/events/event-handler";
import { PaymentsProcessor } from "../payments/payments-processor";
import { DomainEvents } from "@/core/events/domain-events";
import { PeopleRepository } from "../repositories/people-repository";
import { User } from "../entities/user";
import { UUID } from "@/core/entities/uuid";

export class UserVerifiedEvent implements DomainEvent {
  public ocurredAt: Date;
  public user: User;

  constructor(user: User) {
    this.ocurredAt = new Date();
    this.user = user;
  }

  getAggregateId(): UUID {
    return this.user.id;
  }
}

export class OnUserVerified implements EventHandler {
  constructor(
    private peopleRepository: PeopleRepository,
    private paymentsProcessor: PaymentsProcessor
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.registerCustomerOnPaymentProcessor.bind(this),
      UserVerifiedEvent.name
    );
  }

  public async registerCustomerOnPaymentProcessor({ user }: UserVerifiedEvent) {
    // const person = await this.peopleRepository.findByAccountId(
    //   account.id.toString()
    // );
    // if (!person) return; // log issue
    // const customerFullName = `${person.first_name} ${person.last_name}`;
    // const customer = Customer.create({
    //   name: customerFullName,
    //   email: account.email,
    //   cpf: person.cpf,
    // });
    // await this.paymentsProcessor.registerCustomer(customer);
  }
}
