import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { Optional } from "@/core/types/optional";

interface ProductProps {
  name: string;
  image: string;
  pricing: "UNIT" | "WEIGHT";
  type_id: UniqueEntityID;
  created_at: Date;
  updated_at?: Date | null;
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

  static create(
    props: Optional<ProductProps, "created_at">,
    id?: UniqueEntityID
  ) {
    const product = new Product(
      {
        ...props,
        created_at: props.created_at ?? new Date(),
      },
      id
    );

    return product;
  }
}
