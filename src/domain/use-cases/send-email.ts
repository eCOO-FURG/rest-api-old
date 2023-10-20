import { Email } from "../entities/email";
import { Mailer } from "../mail/mailer";

interface SendEmailUseCaseRequest {
  to: string;
  from: string;
  subject: string;
  view: string;
}

export class SendEmailUseCase {
  constructor(private mailer: Mailer) {}

  async execute({ to, from, subject, view }: SendEmailUseCaseRequest) {
    const email = Email.create({
      from,
      to,
      view,
      subject,
    });

    await this.mailer.send(email);
  }
}
