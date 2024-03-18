import { OffersRepository } from "../../repositories/offers-repository";
import { ProductsRepository } from "../../repositories/products-repository";
import { AgribusinessesRepository } from "../../repositories/agribusinesses-repository";
import { Offer } from "../../entities/offer";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { InvalidWeightError } from "../errors/invalid-weight-error";
import { AgribusinessNotActiveError } from "../errors/agribusiness-not-active-error";
import { UUID } from "@/core/entities/uuid";
import { ValidateCycleUseCase } from "./validate-cycle";
import { farthest } from "../utils/fhartest";

interface OfferProductsUseCaseRequest {
  agribusiness_id: string;
  cycle_id: string;
  product: {
    id: string;
    quantity_or_weight: number;
    price: number;
  };
}

export class OfferProductsUseCase {
  constructor(
    private validateScheduleCase: ValidateCycleUseCase,
    private agribusinessRepository: AgribusinessesRepository,
    private offersRepository: OffersRepository,
    private productsRepository: ProductsRepository
  ) {}

  async execute({
    agribusiness_id,
    cycle_id,
    product: offeredProduct,
  }: OfferProductsUseCaseRequest) {
    const { cycle } = await this.validateScheduleCase.execute({
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

    if (product.pricing === "WEIGHT") {
      if (offeredProduct.quantity_or_weight % 50 !== 0) {
        throw new InvalidWeightError("ofertado", product.name);
      }
    }

    const firstOfferingDay = farthest(cycle.offering);

    const activeOffer = await this.offersRepository.findActive(
      agribusiness_id,
      cycle_id,
      firstOfferingDay
    );

    if (activeOffer) {
      const found = activeOffer.find(product.id.value);

      if (found) {
        found.price = offeredProduct.price;
        found.quantity_or_weight = offeredProduct.quantity_or_weight;
        await this.offersRepository.updateItem(found);
        return;
      }

      const item: Offer["items"][0] = {
        id: new UUID(),
        offer_id: activeOffer.id,
        price: offeredProduct.price,
        quantity_or_weight: offeredProduct.quantity_or_weight,
        product_id: product.id,
      };

      await this.offersRepository.saveItem(item);
      return;
    }

    const offer = Offer.create({
      agribusiness_id: agribusiness.id,
      cycle_id: cycle.id,
    });

    offer.add({
      id: new UUID(),
      offer_id: offer.id,
      price: offeredProduct.price,
      product_id: product.id,
      quantity_or_weight: offeredProduct.quantity_or_weight,
    });

    await this.offersRepository.save(offer);
  }
}
