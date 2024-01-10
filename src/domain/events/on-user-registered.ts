import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { Account } from "../entities/account";
import { DomainEvent } from "@/core/events/domain-event";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { PeopleRepository } from "../repositories/people-repository";
import { Encrypter } from "../cryptography/encrypter";
import { env } from "@/infra/env";
import { ViewLoader } from "../mail/view-loader";
import { PaymentsProcessor } from "../payments/payments-processor";
import { Customer } from "../entities/customer";
import { Email } from "../entities/email";
import { Mailer } from "../mail/mailer";

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
    private mailer: Mailer,
    private peopleRepository: PeopleRepository,
    private encrypter: Encrypter,
    private viewLoader: ViewLoader,
    private paymentsProcessor: PaymentsProcessor
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendAccountVerificationEmail.bind(this),
      UserRegisteredEvent.name
    );
    DomainEvents.register(
      this.registerCustomerOnPaymentProcessor.bind(this),
      UserRegisteredEvent.name
    );
  }

  public async sendAccountVerificationEmail({ account }: UserRegisteredEvent) {
    const person = await this.peopleRepository.findByAccountId(
      account.id.toString()
    );

    if (!person) return; // log issue

    const code = await this.encrypter.encrypt({
      account_id: account.id.toString(),
    });

    const view = await this.viewLoader.load("verifyAccount", {
      first_name: person.first_name,
      url: `${env.SERVER_URL}/users/verify?code=${code}`,
    });

    const email = Email.create({
      from: env.ECOO_EMAIL,
      to: account.email,
      subject: "Bem-vindo(a) - Verifique sua conta!",
      view,
    });

    await this.mailer.send(email);
  }

  public async registerCustomerOnPaymentProcessor({
    account,
  }: UserRegisteredEvent) {
    const person = await this.peopleRepository.findByAccountId(
      account.id.toString()
    );

    if (!person) return; // log issue

    const customerFullName = `${person.first_name} ${person.last_name}`;

    const customer = Customer.create({
      full_name: customerFullName,
      cpf: person.cpf.value,
    });

    await this.paymentsProcessor.registerCustomer(customer);
  }
}
