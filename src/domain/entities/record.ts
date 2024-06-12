import { Entity, EntityProps } from "@/core/entities/entity";
import { UUID } from "@/core/entities/uuid";
import { Optional } from "@/core/types/optional";

interface RecordProps
  extends Optional<EntityProps, "created_at" | "updated_at"> {
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

  static create(props: RecordProps, id?: UUID) {
    const record = new Record({ ...props }, id);
    return record;
  }
}
