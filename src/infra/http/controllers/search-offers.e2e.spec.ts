import { app } from "@/infra/app";
import { makeAccessToken } from "test/factories/make-access-token";

describe("", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[GET] /offers", async () => {
    const query = "product=product";

    const access_token = await makeAccessToken("account-id");

    const reply = await app.inject({
      method: "GET",
      url: `/offers?${query}`,
      headers: {
        authorization: `Bearer ${access_token}`,
      },
    });

    expect(reply.statusCode).toBe(200);
  });
});
