import { randomUUID } from "crypto";

export class UniqueEntityID {
  constructor(value?: string) {
    this.value = value ?? randomUUID();
  }

  private value: string;
}
