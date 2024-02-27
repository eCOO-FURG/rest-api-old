import { OneTimePassword } from "../entities/one-time-password";

export interface OtpGenerator {
  generate(): Promise<string>;
}
