import { app } from "@/infra/app";

describe("", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[POST] /users", async () => {
    const reply = await app.inject({
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

    expect(reply.statusCode).toBe(201);
  });
});
