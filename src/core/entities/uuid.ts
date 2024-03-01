import { randomUUID } from "crypto";

export class UUID {
  private value: string;

  constructor(value?: string) {
    this.value = value ?? randomUUID();
  }

  public equals(id: string | UUID) {
    if (typeof id === "string") {
      return this.value === id;
    }
    return this.value === id.value;
  }

  static create(value?: string) {
    return new UUID(value);
  }
}
