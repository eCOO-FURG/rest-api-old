import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { AccountsRepository } from "../repositories/accounts-repository";
import { OffersRepository } from "../repositories/offers-repository";
import { AgribusinessesRepository } from "../repositories/agribusinesses-repository";
import { Offer } from "../entities/offer";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { OfferProduct } from "../entities/offer-product";
import { OffersProductsRepository } from "../repositories/offers-products";
import { ProductsRepository } from "../repositories/products-repository";

interface OfferProductsUseCaseRequest {
  account_id: string;
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
    private accountsRepository: AccountsRepository,
    private agribusinessesRepository: AgribusinessesRepository,
    private offersRepository: OffersRepository,
    private offersProductsRepository: OffersProductsRepository,
    private productsRepository: ProductsRepository
  ) {}

  async execute({
    account_id,
    agribusiness_id,
    products,
  }: OfferProductsUseCaseRequest) {
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

    const productsIds = products.map((product) => product.product_id);

    await Promise.all(
      productsIds.map(async (id) => {
        const product = await this.productsRepository.findById(id);

        if (!product) {
          throw new ResourceNotFoundError(id);
        }
      })
    );

    await this.offersRepository.save(offer);

    products.map(async ({ product_id, amount, quantity, weight }) => {
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
