import { DomainEvent } from "../events/domain-event";
import { DomainEvents } from "../events/domain-events";
import { Optional } from "../types/optional";
import { UUID } from "./uuid";

export interface EntityProps {
  created_at: Date;
  updated_at?: Date | null;
}

export abstract class Entity<Props, Id extends string | UUID = UUID> {
  private _id: Id;
  protected props: Props & EntityProps;

  private _events: DomainEvent[] = [];

  get id() {
    return this._id;
  }

  get created_at() {
    return this.props.created_at;
  }

  get updated_at() {
    return this.props.updated_at;
  }

  touch() {
    this.props.updated_at = new Date();
  }

  public equals(entity: Entity<any>) {
    if (entity === this) {
      return true;
    }

    if (this._id instanceof UUID && this._id.equals(entity.id)) {
      return true;
    }

    return false;
  }

  get events(): DomainEvent[] {
    return this._events;
  }

  protected registerEvent(event: DomainEvent): void {
    this._events.push(event);
    DomainEvents.markEntityForDispatch(this);
  }

  public clearEvents() {
    this._events = [];
  }

  protected constructor(
    props: Props & Optional<EntityProps, "created_at">,
    id?: Id
  ) {
    if (id !== undefined) {
      this._id = id;
    } else {
      this._id = new UUID() as Id;
    }

    this.props = {
      ...props,
      created_at: props.created_at ? props.created_at : new Date(),
    };
  }
}
