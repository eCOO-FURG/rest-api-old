import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { AccountsRepository } from "../repositories/accounts-repository";
import { OffersRepository } from "../repositories/offers-repository";
import { AgribusinessesRepository } from "../repositories/agribusinesses-repository";
import { Offer } from "../entities/offer";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";

interface OfferProductsUseCaseRequest {
  account_id: string;
  agribusiness_id: string;
}

export class OfferProductsUseCase {
  constructor(
    private accountsRepository: AccountsRepository,
    private agribusinessesRepository: AgribusinessesRepository,
    private offersRepository: OffersRepository
  ) {}

  async execute({ account_id, agribusiness_id }: OfferProductsUseCaseRequest) {
    const account = await this.accountsRepository.findById(account_id);

    if (!account) {
      throw new ResourceNotFoundError(account_id);
    }

    const agribusiness = await this.agribusinessesRepository.findById(
      agribusiness_id
    );

    if (!agribusiness) {
      throw new ResourceNotFoundError(agribusiness_id);
    }

    if (!(agribusiness.admin_id.toString() === account.id.toString())) {
      throw new ResourceNotFoundError(agribusiness_id);
    }

    const offer = Offer.create({
      agribusiness_id: new UniqueEntityID(agribusiness_id),
    });

    await this.offersRepository.save(offer);
  }
}
