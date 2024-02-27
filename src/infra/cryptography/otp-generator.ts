import { OtpGenerator } from "@/domain/cryptography/otp-generator";
import { generate } from "otp-generator";

const otpConfig = {
  upperCaseAlphabets: false,
  specialChars: false,
  lowerCaseAlphabets: false,
};

export class OtpProvider implements OtpGenerator {
  async generate(): Promise<string> {
    const otp = generate(6, otpConfig);
    return otp;
  }
}
