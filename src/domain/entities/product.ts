import { Entity, EntityProps } from "@/core/entities/entity";
import { UUID } from "@/core/entities/uuid";
import { Optional } from "@/core/types/optional";

interface ProductProps extends Optional<EntityProps, "created_at"> {
  name: string;
  image: string;
  pricing: "UNIT" | "WEIGHT";
  type_id: UUID;
}

export class Product extends Entity<ProductProps> {
  get name() {
    return this.props.name;
  }

  get image() {
    return this.props.image;
  }

  get pricing() {
    return this.props.pricing;
  }

  get type_id() {
    return this.props.type_id;
  }

  get created_at() {
    return this.props.created_at;
  }

  get updated_at() {
    return this.props.updated_at;
  }

  static create(props: ProductProps, id?: UUID) {
    const product = new Product({ ...props }, id);
    return product;
  }
}
