import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { Optional } from "@/core/types/optional";

interface ProductTypeProps {
  name: string;
  created_at: Date;
  updated_at?: Date | null;
}

export class ProductType extends Entity<ProductTypeProps> {
  get name() {
    return this.props.name;
  }

  get created_at() {
    return this.props.created_at;
  }

  get updated_at() {
    return this.props.updated_at;
  }

  static create(
    props: Optional<ProductTypeProps, "created_at">,
    id?: UniqueEntityID
  ) {
    const productType = new ProductType(
      {
        ...props,
        created_at: props.created_at ?? new Date(),
      },
      id
    );

    return productType;
  }
}
