import { app } from "@/infra/app";

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
        email: "account@ecoo.com",
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
