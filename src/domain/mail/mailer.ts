import { Email } from "../entities/email";

export interface Mailer {
  send(email: Email): Promise<void>;
}
