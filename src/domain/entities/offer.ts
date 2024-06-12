import { Optional } from "@/core/types/optional";
import { Entity, EntityProps } from "@/core/entities/entity";
import { UUID } from "@/core/entities/uuid";
import { Product } from "./product";
import { ResourceAlreadyExistsError } from "../use-cases/errors/resource-already-exists-error";
import { InvalidWeightError } from "../use-cases/errors/invalid-weight-error";
import { InvalidDescriptionError } from "../use-cases/errors/invalid-description-length.error";

interface Item extends Optional<EntityProps, "created_at"> {
  offer_id: UUID;
  product: Product;
  price: number;
  amount: number;
  description: string | null;
}

export interface OfferProps extends Optional<EntityProps, "created_at"> {
  agribusiness_id: UUID;
  cycle_id: UUID;
  items: Item[];
}

export class Offer extends Entity<OfferProps> {
  get agribusiness_id() {
    return this.props.agribusiness_id;
  }

  get cycle_id() {
    return this.props.cycle_id;
  }

  get items() {
    return this.props.items;
  }

  add(item: Optional<Item, "offer_id" | "description">) {
    const found = this.props.items.find((e) => e.product.equals(item.product));

    if (found) {
      throw new ResourceAlreadyExistsError("Oferta de", found.product.name);
    }

    if (item.product.pricing === "WEIGHT" && item.amount % 50 !== 0) {
      throw new InvalidWeightError("ofertado", item.product.name);
    }

    if (item.description && item.description.length > 200) {
      throw new InvalidDescriptionError();
    }

    this.items.push({
      offer_id: this.id,
      description: item.description ?? null,
      created_at: new Date(),
      ...item,
    });

    return;
  }

  find(product: Product) {
    const found = this.props.items.find((item) => item.product.equals(product));

    if (!found) {
      return null;
    }

    return found;
  }

  static create(props: Optional<OfferProps, "items">, id?: UUID) {
    const offer = new Offer(
      {
        ...props,
        items: props.items ?? [],
      },
      id
    );
    return offer;
  }
}
