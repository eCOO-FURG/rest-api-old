import { CollectionRecord } from "../entities/collection-record";

export interface Collection {
  save(record: CollectionRecord): Promise<void>;
  findSimilar(vector: number[]): Promise<CollectionRecord[]>;
}
