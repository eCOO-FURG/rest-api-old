// Entites
import { OneTimePassword } from "@/domain/entities/one-time-password";

// Types
import { UUID } from "@/core/entities/uuid";

// Libs
import { faker } from "@faker-js/faker";

interface CreateOtpRequest {
  user_id: UUID;
  used?: boolean;
}

export class OtpFactory {
  static create({ user_id, used }: CreateOtpRequest) {
    return OneTimePassword.create({
      user_id,
      used,
      value: faker.number
        .bigInt({
          min: 6,
          max: 6,
        })
        .toString(),
    });
  }
}
