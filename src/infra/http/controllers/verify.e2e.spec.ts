import { Cpf } from "@/domain/entities/value-objects/cpf";
import { app } from "@/infra/app";
import { JwtEncrypter } from "@/infra/cryptography/jwt-encrypter";
import { PrismaPeopleRepository } from "@/infra/database/repositories/prisma-people-repository";
import * as JwtService from "jsonwebtoken";

let prismaPeopleRepository: PrismaPeopleRepository;
let jwtEncrypter: JwtEncrypter;

describe("[GET] /verify", () => {
  beforeAll(async () => {
    await app.ready();

    prismaPeopleRepository = new PrismaPeopleRepository();
    jwtEncrypter = new JwtEncrypter(JwtService);
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

    const account = await prismaPeopleRepository.findByCpf(
      Cpf.createFromText("523.065.281-01")
    );

    if (account) {
      const code = await jwtEncrypter.encrypt({
        account_id: account.account_id.toString(),
      });

      const reply = await app.inject({
        method: "GET",
        url: "/verify",
        query: {
          code,
        },
      });

      expect(reply.statusCode).toBe(200);
    }
  });
});
