export class InvalidWeightError extends Error {
  constructor(action: "ofertado" | "solicitado", product_name: string) {
    super(`Peso inválido ${action} para o produto ${product_name}.`);
  }
}
