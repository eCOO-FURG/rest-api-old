import { env } from "@/infra/env";
import { Account } from "../entities/account";
import { Email } from "../entities/email";
import { Person } from "../entities/person";
import { Mailer } from "../mail/mailer";
import { ViewLoader } from "../mail/view-loader";

export interface SendUserVerificationEmailUseCaseRequest {
  account: Account;
  person: Person;
}

export class SendUserVerificationEmailUseCase {
  constructor(private mailer: Mailer, private viewLoader: ViewLoader) {}

  async execute({ account, person }: SendUserVerificationEmailUseCaseRequest) {
    const email = Email.create({
      from: env.ECOO_EMAIL,
      to: account.email,
      html: await this.viewLoader.load("verifyAcccount", {
        first_name: person.first_name,
      }),
      subject: "Welcome to eCOO",
    });

    await this.mailer.send(email);
  }
}
