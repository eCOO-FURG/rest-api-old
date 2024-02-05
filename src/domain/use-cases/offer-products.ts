import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { OffersRepository } from "../repositories/offers-repository";
import { Offer } from "../entities/offer";
import { OfferProduct } from "../entities/offer-product";
import { OffersProductsRepository } from "../repositories/offers-products-repository";
import { ProductsRepository } from "../repositories/products-repository";
import { AgribusinessesRepository } from "../repositories/agribusinesses-repository";
import { NotAgrobusinessAdminError } from "./errors/not-agrobusiness-admin-error";
import { InvalidWeightError } from "./errors/invalid-weight-error";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";

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
    private agribusinessRepository: AgribusinessesRepository,
    private offersRepository: OffersRepository,
    private offersProductsRepository: OffersProductsRepository,
    private productsRepository: ProductsRepository
  ) {}

  async execute({
    agribusiness_id,
    products: offeredProducts,
  }: OfferProductsUseCaseRequest) {
    const offeredProductsIds = offeredProducts.map(
      (offeredProduct) => offeredProduct.id
    );

    const products = await this.productsRepository.findManyByIds(
      offeredProductsIds
    );

    const productsIds = products.map((product) => product.id.toString());

    const offer = Offer.create({
      agribusiness_id: new UniqueEntityID(agribusiness_id),
    });

    const offerProducts = offeredProducts.map((item) => {
      if (!productsIds.includes(item.id)) {
        throw new ResourceNotFoundError(item.id);
      }

      const product = products.find(
        (product) => product.id.toString() === item.id
      )!;

      if (product.pricing === "WEIGHT") {
        if (item.quantity_or_weight % 50 !== 0) {
          throw new InvalidWeightError("offered", product.name);
        }
      }

      return OfferProduct.create({
        offer_id: offer.id,
        price: item.price,
        product_id: product.id,
        quantity_or_weight: item.quantity_or_weight,
      });
    });

    await this.offersRepository.save(offer);

    await this.offersProductsRepository.save(offerProducts);
  }
}
