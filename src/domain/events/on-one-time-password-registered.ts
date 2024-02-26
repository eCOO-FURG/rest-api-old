import { DomainEvent } from "@/core/events/domain-event";
import { OneTimePassword } from "../entities/one-time-password";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { EventHandler } from "@/core/events/event-handler";
import { DomainEvents } from "@/core/events/domain-events";
import { AccountsRepository } from "../repositories/accounts-repository";
import { Mailer } from "../mail/mailer";
import { ViewLoader } from "../mail/view-loader";
import { Email } from "../entities/email";
import { env } from "@/infra/env";

export class OneTimePasswordRegisteredEvent implements DomainEvent {
  public ocurredAt: Date;
  public oneTimePassword: OneTimePassword;

  constructor(oneTimePassword: OneTimePassword) {
    this.ocurredAt = new Date();
    this.oneTimePassword = oneTimePassword;
  }

  getAggregateId(): UniqueEntityID {
    return this.oneTimePassword.id;
  }
}

export class OnOneTimePasswordRegistered implements EventHandler {
  constructor(
    private accountsRepository: AccountsRepository,
    private mailer: Mailer,
    private viewLoader: ViewLoader
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOneTimePasswordEmail.bind(this),
      OneTimePasswordRegisteredEvent.name
    );
  }

  public async sendOneTimePasswordEmail({
    oneTimePassword,
  }: OneTimePasswordRegisteredEvent) {
    const account = await this.accountsRepository.findById(
      oneTimePassword.account_id.toString()
    );

    if (!account) return;

    const view = await this.viewLoader.load("shareOneTimePassword", {
      one_time_password: oneTimePassword.value,
    });

    const email = Email.create({
      from: env.ECOO_EMAIL,
      to: account.email,
      subject: "eCOO | Senha para acesso",
      view,
    });

    await this.mailer.send(email);
  }
}
