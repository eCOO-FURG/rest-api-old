import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { SendEmailUseCase } from "../use-cases/send-email";
import { Account } from "../entities/account";
import { DomainEvent } from "@/core/events/domain-event";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { PeopleRepository } from "../repositories/people-repository";
import { Encrypter } from "../cryptography/encrypter";
import { env } from "@/infra/env";
import { ViewLoader } from "../mail/view-loader";

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
    private sendEmailUseCase: SendEmailUseCase,
    private peopleRepository: PeopleRepository,
    private encrypter: Encrypter,
    private viewLoader: ViewLoader
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendAccountVerificationEmail.bind(this),
      UserRegisteredEvent.name
    );
  }

  public async sendAccountVerificationEmail({ account }: UserRegisteredEvent) {
    const person = await this.peopleRepository.findByAccountId(
      account.id.toString()
    );

    const code = await this.encrypter.encrypt({
      account_id: account.id.toString(),
    });

    if (person) {
      await this.sendEmailUseCase.execute({
        to: account.email,
        from: env.ECOO_EMAIL,
        subject: "Bem-vindo(a) - Verifique sua conta!",
        view: await this.viewLoader.load("verifyAccount", {
          first_name: person.first_name,
          url: `${env.SERVER_URL}/verify?code=${code}`,
        }),
      });
    }
  }
}
