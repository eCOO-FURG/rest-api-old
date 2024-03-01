import { UUID } from "../entities/uuid";

export interface DomainEvent {
  ocurred_at: Date;
  getEntityId(): UUID;
}
