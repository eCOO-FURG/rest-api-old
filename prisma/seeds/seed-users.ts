import { randomUUID } from "crypto";
import { prisma } from "../../src/infra/database/prisma-service";
import { hash } from "bcryptjs";
import { env } from "../../src/infra/env";


const users = [
  {
    "email": "email1@example.com",
    "cellphone": "000-000-0001",
    "password": "password1",
    "first_name": "FirstName1",
    "last_name": "LastName1",
    "cpf": "000.000.001-01"
  },
  {
    "email": "email2@example.com",
    "cellphone": "000-000-0002",
    "password": "password2",
    "first_name": "FirstName2",
    "last_name": "LastName2",
    "cpf": "000.000.002-02"
  }
]

export async function seedUsers() {
  await prisma.account.deleteMany();

  // await prisma.account.create({
  //   data: {
  //     id: randomUUID(),
  //     email: env.ECOO_EMAIL ?? "suporte@ecoo.org.br",
  //     cellphone: "99999999999",
  //     password: env.ECOO_EMAIL_PASSWORD
  //       ? await hash(env.ECOO_EMAIL_PASSWORD, 8)
  //       : await hash("12345678", 8),
  //     verified_at: new Date(),
  //     roles: ["USER", "ADMIN"],
  //     person: {
  //       create: {
  //         first_name: "Administador",
  //         last_name: "CDD",
  //         cpf: "00000000000",
  //       },
  //     },
  //   },
  // });


  for(let user of users)
    await prisma.account.create({
      data: {
        id: randomUUID(),
        email: user.email,
        cellphone: user.cellphone,
        password: user.password
          ? await hash(user.password, 8)
          : await hash("12345678", 8),
        verified_at: new Date(),
        roles: ["USER", "ADMIN"],
        person: {
          create: {
            first_name: user.first_name,
            last_name: user.last_name,
            cpf: user.cpf,
          },
        },
      },
    });
}
