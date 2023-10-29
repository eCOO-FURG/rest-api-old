import { app } from "@/infra/app";

describe("", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[POST] /sessions", async () => {
    const reply = await app.inject({
      method: "POST",
      url: "/sessions",
      payload: {
        email: "test-account@example.com",
        password: "12345678",
      },
    });

    expect(reply.statusCode).toBe(200);
  });
});
