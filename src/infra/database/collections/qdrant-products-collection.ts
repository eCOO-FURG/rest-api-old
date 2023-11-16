import { CollectionRecord } from "@/domain/entities/collection-record";
import { Collection } from "@/domain/repositories/collection";
import { qdrant } from "../../search/qdrant-service";
import { env } from "../../env";
import { QdrantProductMapper } from "../mappers/qdrant-product-mapper";

export class QdrantProductsCollection implements Collection {
  async save(record: CollectionRecord): Promise<void> {
    await qdrant.upsert("products", {
      batch: {
        vectors: [record.embeeding],
        ids: [record.id.toString()],
        payloads: [record.payload],
      },
    });
  }

  async findSimilar(vector: number[]): Promise<CollectionRecord[]> {
    const products = await qdrant.search("products", {
      vector,
      limit: 10,
      score_threshold: env.EXPECTED_SIMILARITY_SCORE,
    });

    return products.map((product) =>
      QdrantProductMapper.toDomain(
        product as {
          id: string;
          score: number;
          payload: Record<string, string>;
          vector: number[];
        }
      )
    );
  }
}
