import { InvalidCpfFormatError } from "./errors/invalid-cpf-format-error";

export class Cpf {
  public value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static createFromText(value: string) {
    const isCpfValid = this.validate(value);

    if (!isCpfValid) {
      throw new InvalidCpfFormatError();
    }

    return new Cpf(value.replace(/[^\d]/g, ""));
  }

  static validate(value: string) {
    const onlyNumericCharactersCpf = value.replace(/[^\d]/g, "");

    if (onlyNumericCharactersCpf.length !== 11) {
      return false;
    }

    const areAllDigitsTheSame = /^(\d)\1+$/.test(onlyNumericCharactersCpf);

    if (areAllDigitsTheSame) return false;

    const firstNineDigits = onlyNumericCharactersCpf.slice(0, 9);

    let sum = 0;

    for (let i = 10; i >= 2; i--) {
      sum =
        parseInt(firstNineDigits.split("").reverse().join("")[i - 2]) * i + sum;
    }

    const firstValidatorDigit = (sum * 10) % 11;

    if (
      (firstValidatorDigit === 10 ? 0 : firstValidatorDigit) !==
      parseInt(onlyNumericCharactersCpf[9])
    ) {
      return false;
    }

    const firstTenDigits = onlyNumericCharactersCpf.slice(0, 10);

    sum = 0;

    for (let i = 11; i >= 2; i--) {
      sum =
        parseInt(firstTenDigits.split("").reverse().join("")[i - 2]) * i + sum;
    }

    const secondValidatorDigit = (sum * 10) % 11;

    if (
      (secondValidatorDigit !== 10 ? secondValidatorDigit : 0) !==
      parseInt(onlyNumericCharactersCpf[10])
    ) {
      return false;
    }

    return true;
  }
}
