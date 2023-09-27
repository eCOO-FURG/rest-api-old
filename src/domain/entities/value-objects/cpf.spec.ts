import { Cpf } from "./cpf";

test("it should be able to create a CPF from text", () => {
  const cpf = Cpf.createFromText("529.982.247-25");

  expect(cpf).toEqual({ value: "52998224725" });
});

test("it should be able to validate a CPF from value", () => {
  const isCpfValid = Cpf.validate("529.982.247-25");

  expect(isCpfValid).toEqual(true);
});
