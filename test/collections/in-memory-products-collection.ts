import { CollectionRecord } from "@/domain/entities/collection-record";
import { Collection } from "@/domain/repositories/collection";

export class InMemoryProductsCollection implements Collection {
  public items: CollectionRecord[] = [];

  async findSimilar(vector: number[]): Promise<CollectionRecord[]> {
    const similars: CollectionRecord[] = [];

    for (const record of this.items) {
      const score = this.calculateSimilarity(vector, record.embeeding);

      if (score >= 0.8) {
        similars.push(record);
      }
    }

    return similars;
  }

  async save(record: CollectionRecord): Promise<void> {
    this.items.push(record);
  }

  private calculateSimilarity(vecA: number[], vecB: number[]): number {
    const max = Math.max(vecA.length, vecB.length);

    const diff = Math.abs(vecA.length - vecB.length);

    return 1 - diff / max;
  }
}
