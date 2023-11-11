import { env } from "@/infra/env";
import * as JwtService from "jsonwebtoken";

export async function makeAccessToken(sub: string) {
  return JwtService.sign({ sub }, env.JWT_SECRET, {
    expiresIn: "10m",
  });
}
