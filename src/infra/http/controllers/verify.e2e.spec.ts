import { app } from "@/infra/app";
import { JwtEncrypter } from "@/infra/cryptography/jwt-encrypter";
import { prisma } from "@/infra/database/prisma-service";
import { hash } from "bcryptjs";
import * as JwtService from "jsonwebtoken";

let jwtEncrypter: JwtEncrypter;

describe("[GET] /verify", () => {
  beforeAll(async () => {
    await app.ready();

    jwtEncrypter = new JwtEncrypter(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  test("[GET] /verify", async () => {
    await prisma.account.create({
      data: {
        id: "1",
        email: "account@example.com",
        password: await hash("12345678", 8),
      },
    });

    const code = await jwtEncrypter.encrypt({
      account_id: "1",
    });

    const reply = await app.inject({
      method: "GET",
      url: "/verify",
      query: {
        code,
      },
    });

    expect(reply.statusCode).toBe(200);
  });
});
