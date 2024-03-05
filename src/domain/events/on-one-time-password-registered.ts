import { DomainEvent } from "@/core/events/domain-event";
import { OneTimePassword } from "../entities/one-time-password";
import { EventHandler } from "@/core/events/event-handler";
import { DomainEvents } from "@/core/events/domain-events";
import { Mailer } from "../mail/mailer";
import { ViewLoader } from "../mail/view-loader";
import { Email } from "../entities/email";
import { env } from "@/infra/env";
import { UsersRepository } from "../repositories/users-repository";
import { UUID } from "@/core/entities/uuid";

export class OneTimePasswordRegisteredEvent implements DomainEvent {
  public ocurred_at: Date;
  public oneTimePassword: OneTimePassword;

  constructor(oneTimePassword: OneTimePassword) {
    this.ocurred_at = new Date();
    this.oneTimePassword = oneTimePassword;
  }

  getEntityId(): UUID {
    return this.oneTimePassword.id;
  }
}

export class OnOneTimePasswordRegistered implements EventHandler {
  constructor(
    private usersRepository: UsersRepository,
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
    const user = await this.usersRepository.findById(
      oneTimePassword.user_id.value
    );

    if (!user) return;

    const view = await this.viewLoader.load("shareOneTimePassword", {
      one_time_password: oneTimePassword.value,
    });

    const email = Email.create({
      from: env.ECOO_EMAIL,
      to: user.email,
      subject: "eCOO | Senha para acesso",
      view,
    });

    await this.mailer.send(email);
  }
}
