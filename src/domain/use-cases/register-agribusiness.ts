import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { AccountsRepository } from "../repositories/accounts-repository";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists-error";
import { Agribusiness } from "../entities/agribusiness";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { AgribusinessesRepository } from "../repositories/agribusinesses-repository";

interface RegisterAgribusinessUseCaseRequest {
  account_id: string;
  caf: string;
  name: string;
}

export class RegisterAgribusinessUseCase {
  constructor(
    private accountsRepository: AccountsRepository,
    private agribusinessesRepository: AgribusinessesRepository
  ) {}

  async execute({ account_id, caf, name }: RegisterAgribusinessUseCaseRequest) {
    const account = await this.accountsRepository.findById(account_id);

    if (!account) {
      throw new ResourceNotFoundError(account_id);
    }

    const agribusinessWithSameCaf =
      await this.agribusinessesRepository.findByCaf(caf);

    if (agribusinessWithSameCaf) {
      throw new ResourceAlreadyExistsError(caf);
    }

    const agribusiness = Agribusiness.create({
      admin_id: new UniqueEntityID(account_id),
      caf,
      name,
    });

    await this.agribusinessesRepository.save(agribusiness);
  }
}
