import { Email } from "@/domain/entities/email";
import { Mailer } from "@/domain/mail/mailer";

export class FakeMailer implements Mailer {
  async send(email: Email): Promise<void> {}
}
