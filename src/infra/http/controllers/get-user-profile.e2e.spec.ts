import { app } from "@/infra/app";
import { generateAccessToken } from "test/factories/generate-access-token";

describe("", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[GET] /me", async () => {
    const access_token = await generateAccessToken();

    const reply = await app.inject({
      method: "GET",
      url: "/me",
      headers: {
        authorization: `Bearer ${access_token}`,
      },
    });

    expect(reply.statusCode).toBe(200);
  });
});
