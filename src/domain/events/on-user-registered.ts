import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { DomainEvent } from "@/core/events/domain-event";
import { Encrypter } from "../cryptography/encrypter";
import { env } from "@/infra/env";
import { ViewLoader } from "../mail/view-loader";
import { Email } from "../entities/email";
import { Mailer } from "../mail/mailer";
import { UUID } from "@/core/entities/uuid";
import { User } from "../entities/user";

export class UserRegisteredEvent implements DomainEvent {
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

export class OnUserRegistered implements EventHandler {
  constructor(
    private mailer: Mailer,
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

  public async sendAccountVerificationEmail({ user }: UserRegisteredEvent) {
    const code = await this.encrypter.encrypt({
      user_id: user.id.value,
    });

    const view = await this.viewLoader.load("verifyAccount", {
      first_name: user.first_name,
      url: `${env.SERVER_URL}:${
        env.SERVER_REDIRECT_PORT ? env.SERVER_REDIRECT_PORT : env.SERVER_PORT
      }/users/verify?code=${code}`,
    });

    const email = Email.create({
      from: env.ECOO_EMAIL,
      to: user.email,
      subject: "eCOO | Verifique sua conta!",
      view,
    });

    await this.mailer.send(email);
  }
}
