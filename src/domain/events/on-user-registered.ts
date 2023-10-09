import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { SendEmailUseCase } from "../use-cases/send-email";
import { Account } from "../entities/account";
import { DomainEvent } from "@/core/events/domain-event";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { PeopleRepository } from "../repositories/people-repository";

export class UserRegisteredEvent implements DomainEvent {
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

export class OnUserRegistered implements EventHandler {
  constructor(
    private peopleRepository: PeopleRepository,
    private sendEmailUseCase: SendEmailUseCase
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendUserRegisteredEmail.bind(this),
      UserRegisteredEvent.name
    );
  }

  public async sendUserRegisteredEmail({ account }: UserRegisteredEvent) {
    const person = await this.peopleRepository.findByAccountId(
      account.id.toString()
    );

    if (person) {
      await this.sendEmailUseCase.execute({ account, person });
    }
  }
}
