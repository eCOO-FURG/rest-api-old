import { Cellphone } from "./cellphone";
import { InvalidCellphoneFormatError } from "./errors/invalid-cellphone-format-error";

test("it should be able to create a Cellphone from text", () => {
  const cellphone = Cellphone.createFromText("(51) 98765-4321");

  expect(cellphone).toEqual({ value: "51987654321" });
});

test("it should be not create a Cellphone from invalid text", () => {
  expect(() => {
    Cellphone.createFromText("(51) 9asdada");
  }).toThrow(InvalidCellphoneFormatError);
});

test("it should be able to validate a Cellphone from value", () => {
  const isCellphoneValid = Cellphone.validate("(51) 98765-4321");

  expect(isCellphoneValid).toEqual(true);
});
