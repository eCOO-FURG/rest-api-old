import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { CollectionRecord } from "@/domain/entities/collection-record";
import { Product } from "@/domain/entities/product";

export class QdrantProductMapper {
  static toDomain(raw: {
    id: string;
    score: number;
    payload: Record<string, string>;
    vector: number[];
  }) {
    return CollectionRecord.create(
      {
        embeeding: raw.vector,
        payload: raw.payload,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toQdrant(product: Product) {
    return {};
  }
}
