import { UUID } from "@/core/entities/uuid";
import { Agribusiness } from "../agribusiness";
import { OfferProps } from "../offer";
import { ValueObject } from "./value-object";

export interface OfferWithAgribusinessProps
  extends Omit<OfferProps, "agribusiness_id"> {
  id: UUID;
  agribusiness: Agribusiness;
}

export class OfferWithAgribusiness extends ValueObject<OfferWithAgribusinessProps> {
  static create(props: OfferWithAgribusinessProps) {
    const offerWithAgribusiness = new OfferWithAgribusiness(props);
    return offerWithAgribusiness;
  }

  get id() {
    return this.props.id;
  }

  get cycle_id() {
    return this.props.cycle_id;
  }

  get agribusiness() {
    return this.props.agribusiness;
  }

  get items() {
    return this.props.items;
  }

  get created_at() {
    return this.props.created_at;
  }

  get updated_at() {
    return this.props.updated_at;
  }
}
