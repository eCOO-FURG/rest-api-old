import { app } from "@/infra/app";
import { generateAccessToken } from "test/factories/generate-access-token";

describe("", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[POST] /sessions/refresh", async () => {
    const { json } = await app.inject({
      method: "POST",
      url: "/sessions",
      payload: {
        email: "test-account@example.com",
        password: "12345678",
      },
    });

    const reply = await app.inject({
      method: "POST",
      url: "/sessions/refresh",
      payload: {
        access_token: json().access_token,
      },
    });

    expect(reply.statusCode).toBe(200);
  });
});
