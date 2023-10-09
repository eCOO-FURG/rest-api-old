import { env } from "@/infra/env";
import { Account } from "../entities/account";
import { Email } from "../entities/email";
import { Person } from "../entities/person";
import { Mailer } from "../mail/mailer";

export interface SendUserVerificationEmailUseCaseRequest {
  account: Account;
  person: Person;
}

export class SendUserVerificationEmailUseCase {
  constructor(private mailer: Mailer) {}

  async execute({ account, person }: SendUserVerificationEmailUseCaseRequest) {
    const email = Email.create({
      from: env.ECOO_EMAIL,
      to: account.email,
      html: "<h1>Hello world!</h1>",
      subject: "Welcome to eCOO",
    });

    await this.mailer.send(email);
  }
}
