import { Email } from "@/domain/entities/email";
import { Mailer } from "@/domain/mail/mailer";
import { Transporter } from "nodemailer";
import { env } from "../env";

export class Nodemailer implements Mailer {
  constructor(private transporter: Transporter) {}

  async send(email: Email): Promise<void> {
    await this.transporter.sendMail({
      from: env.ECOO_EMAIL,
      to: email.to,
      subject: email.subject,
      html: email.html,
    });
  }
}
