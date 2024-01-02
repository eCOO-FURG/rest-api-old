import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { OffersRepository } from "../repositories/offers-repository";
import { Offer } from "../entities/offer";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { OfferProduct } from "../entities/offer-product";
import { OffersProductsRepository } from "../repositories/offers-products-repository";
import { ProductsRepository } from "../repositories/products-repository";
import { AgribusinessesRepository } from "../repositories/agribusinesses-repository";

interface OfferProductsUseCaseRequest {
  agribusiness_id: string;
  products: {
    product_id: string;
    weight: string;
    quantity: string;
    amount: string;
  }[];
}

export class OfferProductsUseCase {
  constructor(
    private agribusinessRepository: AgribusinessesRepository,
    private offersRepository: OffersRepository,
    private offersProductsRepository: OffersProductsRepository,
    private productsRepository: ProductsRepository
  ) {}

  async execute({ agribusiness_id, products }: OfferProductsUseCaseRequest) {
    const agribusiness = this.agribusinessRepository.findById(agribusiness_id);

    if (!agribusiness) {
      throw new ResourceNotFoundError(agribusiness_id);
    }

    const productsIds = products.map((product) => product.product_id);

    await Promise.all(
      productsIds.map(async (id) => {
        const product = await this.productsRepository.findById(id);

        if (!product) {
          throw new ResourceNotFoundError(id);
        }
      })
    );

    const weekday = new Date().getDate();

    const offerStatus = weekday === 0 || weekday === 1 ? "READY" : "ON HOLD";

    const offer = Offer.create({
      agribusiness_id: new UniqueEntityID(agribusiness_id),
      status: offerStatus,
    });

    await this.offersRepository.save(offer);

    products.forEach(async ({ product_id, amount, quantity, weight }) => {
      const offerProduct = OfferProduct.create({
        offer_id: offer.id,
        product_id: new UniqueEntityID(product_id),
        amount,
        quantity,
        weight,
      });

      await this.offersProductsRepository.save(offerProduct);
    });
  }
}
