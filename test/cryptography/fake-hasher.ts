import { HashService } from "@/domain/cryptography/hash-service";

export class FakeHasher implements HashService {
  async hash(plain: string): Promise<string> {
    return plain.concat("-hashed");
  }
}
