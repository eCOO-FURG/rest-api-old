import { UUID } from "@/core/entities/uuid";

export type Update<T> = {
  id: UUID;
} & Partial<T>;
