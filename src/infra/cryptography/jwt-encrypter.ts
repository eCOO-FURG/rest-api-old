import { Encrypter } from "@/domain/cryptography/encrypter";
import * as JwtService from "jsonwebtoken";
import { env } from "../env";

export class JwtEncrypter implements Encrypter {
  constructor(private jwtService: typeof JwtService) {}

  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return this.jwtService.sign(payload, env.JWT_SECRET);
  }
}
