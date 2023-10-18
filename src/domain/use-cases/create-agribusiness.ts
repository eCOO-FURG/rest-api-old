import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { AccountsRepository } from "../repositories/accounts-repository";
import { AgribusinessRepository } from "../repositories/agribusiness-repository";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists-error";
import { Agribusiness } from "../entities/agribusiness";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";

interface CreateAgribusinessUseCaseRequest {
  account_id: string;
  caf: string;
  name: string;
}

export class CreateAgribusinessUseCase {
  constructor(
    private accountsRepository: AccountsRepository,
    private agribusinessRepository: AgribusinessRepository
  ) {}

  async execute({ account_id, caf, name }: CreateAgribusinessUseCaseRequest) {
    const account = await this.accountsRepository.findById(account_id);

    if (!account) {
      throw new ResourceNotFoundError(account_id);
    }

    const agribusinessWithSameCaf = await this.agribusinessRepository.findByCaf(
      caf
    );

    if (agribusinessWithSameCaf) {
      throw new ResourceAlreadyExistsError(caf);
    }

    const agribusiness = Agribusiness.create({
      admin_id: new UniqueEntityID(account_id),
      caf,
      name,
    });

    await this.agribusinessRepository.save(agribusiness);
  }
}
