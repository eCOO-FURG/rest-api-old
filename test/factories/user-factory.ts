// Entities
import { User } from "@/domain/entities/user";

// Libs
import { faker } from "@faker-js/faker";

interface CreateUserRequest {
  verified?: boolean;
  password?: string;
}

export class UserFactory {
  static create({ verified, password }: CreateUserRequest = {}) {
    return User.create({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      cpf: "716.361.797-62",
      phone: faker.phone.number(),
      password,
      verified_at: verified ? new Date() : null,
    });
  }
}
