import { OffersRepository } from "../../repositories/offers-repository";
import { ProductsRepository } from "../../repositories/products-repository";
import { AgribusinessesRepository } from "../../repositories/agribusinesses-repository";
import { Offer } from "../../entities/offer";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { AgribusinessNotActiveError } from "../errors/agribusiness-not-active-error";
import { farthestDayBetween } from "../utils/fhartest-day-between";
import { ValidateCycleActionUseCase } from "./validate-cycle-action";

interface OfferProductsUseCaseRequest {
  agribusiness_id: string;
  cycle_id: string;
  product: {
    id: string;
    amount: number;
    price: number;
    description?: string;
  };
}

export class OfferProductsUseCase {
  constructor(
    private validateCycleActionUseCase: ValidateCycleActionUseCase,
    private agribusinessRepository: AgribusinessesRepository,
    private offersRepository: OffersRepository,
    private productsRepository: ProductsRepository
  ) {}

  async execute({
    agribusiness_id,
    cycle_id,
    product: offeredProduct,
  }: OfferProductsUseCaseRequest) {
    const { cycle } = await this.validateCycleActionUseCase.execute({
      cycle_id,
      action: "offering",
    });

    const agribusiness = await this.agribusinessRepository.findById(
      agribusiness_id
    );

    if (!agribusiness) {
      throw new ResourceNotFoundError("Agronegócio", agribusiness_id);
    }

    if (!agribusiness.active) {
      throw new AgribusinessNotActiveError();
    }

    const product = await this.productsRepository.findById(offeredProduct.id);

    if (!product) {
      throw new ResourceNotFoundError("Produto", offeredProduct.id);
    }

    const firstOfferingDay = farthestDayBetween(cycle.offering);

    const activeOffer = await this.offersRepository.findActive(
      agribusiness_id,
      cycle_id,
      firstOfferingDay
    );

    const item = {
      product,
      price: offeredProduct.price,
      amount: offeredProduct.amount,
      description: offeredProduct.description ?? null,
    };

    if (activeOffer) {
      activeOffer.add(item);
      await this.offersRepository.update(activeOffer);
      return;
    }

    const offer = Offer.create({
      agribusiness_id: agribusiness.id,
      cycle_id: cycle.id,
    });

    offer.add(item);
    await this.offersRepository.save(offer);
  }
}
