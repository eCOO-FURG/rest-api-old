import { env } from "@/infra/env";
import * as JwtService from "jsonwebtoken";

export async function generateAccessToken() {
  return JwtService.sign({ sub: "test-account" }, env.JWT_SECRET, {
    expiresIn: "10m",
  });
}
