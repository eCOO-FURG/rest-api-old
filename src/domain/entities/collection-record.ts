import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";

interface CollectionRecordProps {
  embeeding: number[];
  payload: Record<string, string>;
}

export class CollectionRecord extends Entity<CollectionRecordProps> {
  get embeeding() {
    return this.props.embeeding;
  }

  get payload() {
    return this.props.payload;
  }

  static create(props: CollectionRecordProps, id?: UniqueEntityID) {
    const collectionRecord = new CollectionRecord(
      {
        ...props,
      },
      id
    );

    return collectionRecord;
  }
}
