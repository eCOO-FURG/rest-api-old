export class InvalidWeightError extends Error {
  constructor(action: "ofertado" | "solicitado", product: string) {
    super(`Peso inválido ${action} para o produto ${product}.`);
  }
}
