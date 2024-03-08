import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Agribusiness } from "../entities/agribusiness";
import { AgribusinessesRepository } from "../repositories/agribusinesses-repository";
import { AlreadyAgribusinessAdminError } from "./errors/already-agribusiness-admin-error";
import { UsersRepository } from "../repositories/users-repository";
import { ResourceAlreadyExistsError } from "./errors/resource-already-exists-error";

interface RegisterAgribusinessUseCaseRequest {
  user_id: string;
  caf: string;
  name: string;
}

export class RegisterAgribusinessUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private agribusinessesRepository: AgribusinessesRepository
  ) {}

  async execute({ user_id, caf, name }: RegisterAgribusinessUseCaseRequest) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new ResourceNotFoundError("Usuário", user_id);
    }

    const agribusinessWithSameCaf =
      await this.agribusinessesRepository.findByCaf(caf);

    if (agribusinessWithSameCaf) {
      throw new ResourceAlreadyExistsError("CAF", caf);
    }

    const agribusinessWithSameAdmin =
      await this.agribusinessesRepository.findByAdminId(user_id);

    if (agribusinessWithSameAdmin) {
      throw new AlreadyAgribusinessAdminError();
    }

    const agribusiness = Agribusiness.create({
      admin_id: user.id,
      caf,
      name,
    });

    await this.agribusinessesRepository.save(agribusiness);

    return {
      agribusiness,
    };
  }
}
