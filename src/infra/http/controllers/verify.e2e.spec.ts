import { app } from "@/infra/app";

describe("[GET] /verify", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[GET] /verify", async () => {
    await app.inject({
      method: "POST",
      url: "/users",
      payload: {
        email: "johndoe@example.com",
        password: "12345678",
        first_name: "John",
        last_name: "Doe",
        cpf: "523.065.281-01",
      },
    });

    const code = "";

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
