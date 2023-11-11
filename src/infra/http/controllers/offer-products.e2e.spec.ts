import { app } from "@/infra/app";
import { makeAccessToken } from "test/factories/make-access-token";

describe("", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[POST] /offers", async () => {
    const access_token = await makeAccessToken("account-id");

    const reply = await app.inject({
      method: "POST",
      url: "/offers",
      headers: {
        authorization: `Bearer ${access_token}`,
      },
      payload: {
        products: [
          {
            product_id: "product-id",
            weight: "2",
            quantity: "2",
            amount: "2",
          },
        ],
      },
    });

    expect(reply.statusCode).toBe(201);
  });
});
