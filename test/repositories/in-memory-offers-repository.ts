import { Offer } from "@/domain/entities/offer";
import { OffersRepository } from "@/domain/repositories/offers-repository";
import { InMemoryAgribusinessesRepository } from "./in-memory-agribusinesses-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { OfferWithAgribusiness } from "@/domain/entities/value-objects/offer-with-agribusiness";
import { UUID } from "@/core/entities/uuid";

export class InMemoryOffersRepository implements OffersRepository {
  items: Offer[] = [];

  constructor(
    private inMemoryAgribusinessRepository: InMemoryAgribusinessesRepository
  ) {}

  async save(offer: Offer): Promise<void> {
    this.items.push(offer);
  }

  async update(offer: Offer): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(offer.id));

    this.items[index] = offer;
  }

  findManyByOffersIdsAndProductsIds(
    offers_ids: string[],
    products_ids: string[]
  ): Promise<Offer[]> {
    throw new Error("Method not implemented.");
  }

  async findManyItemsByCycleIdProductsIdsAndOfferCreatedAt(
    cycle_id: string,
    product_ids: string[],
    date: Date,
    page = 1
  ): Promise<Offer["items"]> {
    const items: Offer["items"] = [];

    for (const offer of this.items) {
      const match = offer.items.filter(({ product }) => {
        return (
          product_ids.includes(product.id.value) &&
          offer.created_at >= date &&
          offer.cycle_id.equals(cycle_id)
        );
      });
      items.push(...match);
    }

    const start = (page - 1) * 20;
    const end = start + 20;

    return items.slice(start, end);
  }

  async findManyActiveWithAgribusiness(
    cycle_id: string,
    target_date: Date,
    page: number = 1,
    product_name?: string
  ): Promise<OfferWithAgribusiness[]> {
    const start = (page - 1) * 20;
    const end = start + 20;

    const offersWithAgribusiness = this.items
      .filter(
        (item) =>
          item.cycle_id.equals(cycle_id) && item.created_at >= target_date
      )
      .filter((item) =>
        item.items.some((_) => _.product.name.includes(product_name ?? ""))
      )
      .slice(start, end)
      .map((item) => {
        const agribusiness = this.inMemoryAgribusinessRepository.items.find(
          (agribusiness) => {
            return agribusiness.id.equals(item.agribusiness_id);
          }
        );

        if (!agribusiness) {
          throw new ResourceNotFoundError(
            "Agribusiness",
            item.agribusiness_id.value
          );
        }

        return OfferWithAgribusiness.create({
          id: item.id,
          items: item.items,
          created_at: item.created_at,
          updated_at: item.updated_at,
          cycle_id: item.cycle_id,
          agribusiness,
        });
      });

    return offersWithAgribusiness;
  }

  async findActive(
    agribusiness_id: string,
    cycle_id: string,
    target_date: Date
  ): Promise<Offer | null> {
    const offer = this.items.find(
      (item) =>
        item.agribusiness_id.equals(agribusiness_id) &&
        item.cycle_id.equals(cycle_id) &&
        item.created_at >= target_date
    );

    if (!offer) {
      return null;
    }

    return offer;
  }
}
