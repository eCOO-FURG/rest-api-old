import { randomUUID } from "crypto";

export class UniqueEntityID {
  constructor(value?: string) {
    this.value = value ?? randomUUID();
  }

  private value: string;

  toString() {
    return this.value;
  }

  public equals(id: UniqueEntityID) {
    return id.toString() === this.toString();
  }
}
