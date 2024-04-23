import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Hasher } from "@/domain/cryptography/hasher";
import { UsersRepository } from "@/domain/repositories/users-repository";
import { SamePaswordError } from "../errors/same-password-error";

interface UpdatePasswordUseCaseRequest {
  user_id: string;
  password: string;
}

export class UpdatePasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hasher: Hasher
  ) {}

  async execute({ user_id, password }: UpdatePasswordUseCaseRequest) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new ResourceNotFoundError("Usuário", user_id);
    }

    const hashedPassword = await this.hasher.hash(password);

    const samePassword = hashedPassword === user.password;

    if (samePassword) {
      throw new SamePaswordError();
    }

    user.protect(hashedPassword);

    await this.usersRepository.update(user);
  }
}
