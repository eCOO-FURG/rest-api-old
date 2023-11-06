import { app } from "@/infra/app";
import { generateAccessToken } from "test/factories/generate-access-token";

describe("", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[POST] /offers", async () => {
    const access_token = await generateAccessToken();

    const reply = await app.inject({
      method: "POST",
      url: "/offers",
      headers: {
        authorization: `Bearer ${access_token}`,
      },
      payload: {
        agribusiness_id: "fake-agribusiness-id",
        products: [
          {
            product_id: "fake-product-id",
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
