import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";

interface RecordProps {
  name: string;
  score?: number;
}

export class Record extends Entity<RecordProps> {
  get name() {
    return this.props.name;
  }

  get score() {
    return this.props.score;
  }

  static create(props: RecordProps, id?: UniqueEntityID) {
    const record = new Record({ ...props }, id);

    return record;
  }
}
