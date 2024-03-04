import { Entity, EntityProps } from "@/core/entities/entity";
import { UUID } from "@/core/entities/uuid";
import { Optional } from "@/core/types/optional";

interface ProductTypeProps extends Optional<EntityProps, "created_at"> {
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

  static create(props: ProductTypeProps, id?: UUID) {
    const productType = new ProductType({ ...props }, id);
    return productType;
  }
}
