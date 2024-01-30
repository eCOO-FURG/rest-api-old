import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { OffersRepository } from "../repositories/offers-repository";
import { Offer } from "../entities/offer";
import { OfferProduct } from "../entities/offer-product";
import { OffersProductsRepository } from "../repositories/offers-products-repository";
import { ProductsRepository } from "../repositories/products-repository";
import { AgribusinessesRepository } from "../repositories/agribusinesses-repository";
import { NotAgrobusinessAdminError } from "./errors/not-agrobusiness-admin-error";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";

interface OfferProductsUseCaseRequest {
  agribusiness_id: string;
  products: {
    id: string;
    weight: string;
    quantity: number;
    price: string;
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
    const agribusiness = await this.agribusinessRepository.findById(
      agribusiness_id
    );

    if (!agribusiness) {
      throw new NotAgrobusinessAdminError();
    }

    const offeredProductsIds = offeredProducts.map(
      (offeredProduct) => offeredProduct.id
    );

    const products = await this.productsRepository.findManyByIds(
      offeredProductsIds
    );

    const productsIds = products.map((product) => product.id.toString());

    for (const offeredProduct of offeredProducts) {
      if (!productsIds.includes(offeredProduct.id)) {
        throw new ResourceNotFoundError(offeredProduct.id);
      }
    }

    const offer = Offer.create({
      agribusiness_id: agribusiness.id,
    });

    await this.offersRepository.save(offer);

    const offerProducts = offeredProducts.map((product) =>
      OfferProduct.create({
        offer_id: offer.id,
        product_id: new UniqueEntityID(product.id),
        price: product.price,
        weight: product.weight,
        quantity: product.quantity,
      })
    );

    await this.offersProductsRepository.save(offerProducts);
  }
}
