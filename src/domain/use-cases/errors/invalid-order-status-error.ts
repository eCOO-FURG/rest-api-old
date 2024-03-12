export class InvalidOrderStatusError extends Error {
  constructor() {
    super("Não é possível mudar o status de um pedido que já foi cancelado.");
  }
}
