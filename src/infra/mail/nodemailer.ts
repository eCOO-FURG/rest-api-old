import { Email } from "@/domain/entities/email";
import { Mailer } from "@/domain/mail/mailer";
import { Transporter } from "nodemailer";
import { env } from "@/infra/env";
import { Logger } from "@/infra/log/logger";

export class Nodemailer implements Mailer {
  constructor(private transporter: Transporter) {}

  async send(email: Email): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: env.ECOO_EMAIL,
        to: email.to,
        subject: email.subject,
        html: email.html,
      });
    } catch (error) {
      Logger.log(error);
    }
  }
}
