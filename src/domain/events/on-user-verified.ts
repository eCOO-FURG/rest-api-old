import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { DomainEvent } from "@/core/events/domain-event";
import { Account } from "../entities/account";
import { EventHandler } from "@/core/events/event-handler";
import { PaymentsProcessor } from "../payments/payments-processor";
import { DomainEvents } from "@/core/events/domain-events";
import { PeopleRepository } from "../repositories/people-repository";
import { Customer } from "../entities/customer";

export class UserVerifiedEvent implements DomainEvent {
  public ocurredAt: Date;
  public account: Account;

  constructor(account: Account) {
    this.ocurredAt = new Date();
    this.account = account;
  }

  getAggregateId(): UniqueEntityID {
    return this.account.id;
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

  public async registerCustomerOnPaymentProcessor({
    account,
  }: UserVerifiedEvent) {
    const person = await this.peopleRepository.findByAccountId(
      account.id.toString()
    );

    if (!person) return; // log issue

    const customerFullName = `${person.first_name} ${person.last_name}`;

    const customer = Customer.create({
      name: customerFullName,
      cpf: person.cpf,
    });

    await this.paymentsProcessor.registerCustomer(customer);
  }
}
