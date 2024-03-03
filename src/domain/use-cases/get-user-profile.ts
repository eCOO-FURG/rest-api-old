import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UsersRepository } from "../repositories/users-repository";

interface GetUserProfileUseCaserRequest {
  user_id: string;
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ user_id }: GetUserProfileUseCaserRequest) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new ResourceNotFoundError(user_id);
    }

    return {
      user,
    };
  }
}
