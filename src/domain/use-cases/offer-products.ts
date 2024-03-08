import { OffersRepository } from "../repositories/offers-repository";
import { ProductsRepository } from "../repositories/products-repository";
import { AgribusinessesRepository } from "../repositories/agribusinesses-repository";
import { Offer } from "../entities/offer";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { InvalidWeightError } from "./errors/invalid-weight-error";
import { AgribusinessNotActiveError } from "./errors/agribusiness-not-active-error";
import { UUID } from "@/core/entities/uuid";
import { ValidateScheduleUseCase } from "./validate-schedule";

interface OfferProductsUseCaseRequest {
  agribusiness_id: string;
  products: {
    id: string;
    quantity_or_weight: number;
    price: number;
  }[];
}

export class OfferProductsUseCase {
  constructor(
    private validateScheduleCase: ValidateScheduleUseCase,
    private agribusinessRepository: AgribusinessesRepository,
    private offersRepository: OffersRepository,
    private productsRepository: ProductsRepository
  ) {}

  async execute({
    agribusiness_id,
    products: offeredProducts,
  }: OfferProductsUseCaseRequest) {
    await this.validateScheduleCase.execute({
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

    const offeredProductsIds = offeredProducts.map((product) => product.id);

    const products = await this.productsRepository.findManyByIds(
      offeredProductsIds
    );

    const offer = Offer.create({
      agribusiness_id: agribusiness.id,
    });

    for (const item of offeredProducts) {
      const product = products.find((product) => product.id.equals(item.id));

      if (!product) {
        throw new ResourceNotFoundError("Produto", item.id);
      }

      if (product.pricing === "WEIGHT") {
        if (item.quantity_or_weight % 50 !== 0) {
          throw new InvalidWeightError("ofertado", product.name);
        }
      }

      offer.add({
        id: new UUID(),
        offer_id: offer.id,
        price: item.price,
        product_id: product.id,
        quantity_or_weight: item.quantity_or_weight,
      });
    }

    await this.offersRepository.save(offer);
  }
}
