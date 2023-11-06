import { app } from "@/infra/app";
import { generateAccessToken } from "test/factories/generate-access-token";

describe("", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[POST] /products", async () => {
    const access_token = await generateAccessToken("fake-account-id");

    const reply = await app.inject({
      method: "POST",
      url: "/products",
      headers: {
        authorization: `Bearer ${access_token}`,
      },
      payload: {
        name: "Batata",
      },
    });

    expect(reply.statusCode).toBe(201);
  });
});
