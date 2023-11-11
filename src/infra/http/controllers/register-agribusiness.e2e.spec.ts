import { app } from "@/infra/app";
import { prisma } from "@/infra/database/prisma-service";
import { hash } from "bcryptjs";
import { makeAccessToken } from "test/factories/make-access-token";

describe("", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[POST] /agribusinesses", async () => {
    await prisma.account.create({
      data: {
        id: "1",
        email: "account@example.com",
        password: await hash("12345678", 8),
        verified_at: new Date(),
      },
    });

    const access_token = await makeAccessToken("1");

    const reply = await app.inject({
      method: "POST",
      url: "/agribusinesses",
      headers: {
        authorization: `Bearer ${access_token}`,
      },
      payload: {
        caf: "new-caf",
        name: "new-agribusiness-name",
      },
    });

    expect(reply.statusCode).toBe(201);
  });
});
