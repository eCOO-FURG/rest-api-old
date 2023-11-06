import { env } from "@/infra/env";
import * as JwtService from "jsonwebtoken";

export async function generateAccessToken() {
  return JwtService.sign({ sub: "fake-account-id" }, env.JWT_SECRET, {
    expiresIn: "10m",
  });
}
