import { InvalidCellphoneFormatError } from "./errors/invalid-cellphone-format-error";

const brazilianCellphoneRegex =
  /^(\+\d{1,3}\s?)?(\(\d{2,3}\)|\d{2,3})?[\s-]?\d{4,5}[\s-]?\d{4}$/;

export class Cellphone {
  public value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static createFromText(value: string) {
    const onlyNumericCharactersCellphone = value.replace(/[^\d]/g, "");

    const isCellphoneValid = this.validate(onlyNumericCharactersCellphone);

    if (!isCellphoneValid) {
      throw new InvalidCellphoneFormatError();
    }

    return new Cellphone(onlyNumericCharactersCellphone);
  }

  static validate(value: string) {
    return brazilianCellphoneRegex.test(value);
  }
}
