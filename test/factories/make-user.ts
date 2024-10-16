import { User } from "@/domain/entities/user";
import { faker } from "@faker-js/faker";

interface MakeUserRequest {
  verified_at?: Date;
  password?: string;
}

export function makeUser({ verified_at, password }: MakeUserRequest = {}) {
  return User.create({
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    cpf: faker.number
      .bigInt({
        min: 11,
        max: 11,
      })
      .toString(),
    password: password ?? undefined,
    phone: faker.phone.number(),
    verified_at: verified_at,
  });
}
