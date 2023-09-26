import { UniqueEntityID } from "./value-objects/unique-entity-id";

export abstract class Entity<Props> {
  private _id: UniqueEntityID;
  protected props: Props;

  protected constructor(props: Props, id?: UniqueEntityID) {
    this._id = id ?? new UniqueEntityID();
    this.props = props;
  }
}
