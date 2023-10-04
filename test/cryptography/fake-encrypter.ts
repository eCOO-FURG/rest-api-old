import { Encrypter } from "@/domain/cryptography/encrypter";

export class FakeEncrypter implements Encrypter {
  async encrypt(payload: Record<string, string>): Promise<string> {
    return JSON.stringify(payload);
  }

  decode(value: string): Promise<Record<string, string>> {
    return JSON.parse(value);
  }
}
