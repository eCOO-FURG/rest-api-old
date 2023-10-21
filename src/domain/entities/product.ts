import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { Optional } from "@/core/types/optional";

interface ProductProps {
  name: string;
  created_at: Date;
  updated_at?: Date | null;
}

export class Product extends Entity<ProductProps> {
  get name() {
    return this.props.name;
  }

  static create(
    props: Optional<ProductProps, "created_at">,
    id?: UniqueEntityID
  ) {
    const product = new Product({
      ...props,
      created_at: props.created_at ?? new Date(),
    });

    return product;
  }
}
