import { env } from "@/infra/env";
import { Account } from "../entities/account";
import { Email } from "../entities/email";
import { Person } from "../entities/person";
import { Mailer } from "../mail/mailer";
import { ViewLoader } from "../mail/view-loader";
import { Encrypter } from "../cryptography/encrypter";

interface SendUserVerificationEmailUseCaseRequest {
  account: Account;
  person: Person;
}

export class SendUserVerificationEmailUseCase {
  constructor(
    private mailer: Mailer,
    private viewLoader: ViewLoader,
    private encrypter: Encrypter
  ) {}

  async execute({ account, person }: SendUserVerificationEmailUseCaseRequest) {
    const code = await this.encrypter.encrypt({
      account_id: account.id.toString(),
    });

    const email = Email.create({
      from: env.ECOO_EMAIL,
      to: account.email,
      html: await this.viewLoader.load("verifyAccount", {
        first_name: person.first_name,
        url: `${env.SERVER_URL}/verify?code=${code}`,
      }),
      subject: "Welcome to eCOO",
    });

    await this.mailer.send(email);
  }
}
