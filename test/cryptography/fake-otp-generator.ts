import { OtpGenerator } from "@/domain/cryptography/otp-generator";

export class FakeOtpGenerator implements OtpGenerator {
  async generate(): Promise<string> {
    const value = Math.floor(Math.random() * 1000000);

    const formattedValue = value.toString().padStart(6, "0");

    return formattedValue;
  }
}
