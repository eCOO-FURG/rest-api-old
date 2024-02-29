// import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
// import { ListOfOrdersUseCase } from "./list-of-orders";
// import { Cellphone } from "../entities/value-objects/cellphone";
// import { Account } from "../entities/account";
// import { Order } from "../entities/order";

// let inMemoryOrdersRepository: InMemoryOrdersRepository;
// let sut: ListOfOrdersUseCase;
// describe("list of orders", () => {
//   beforeEach(() => {
//     inMemoryOrdersRepository = new InMemoryOrdersRepository();
//     sut = new ListOfOrdersUseCase(inMemoryOrdersRepository);
//   });
// });

// it("should be able to list orders with READY status", async () => {
//   const account = Account.create({
//     email: "test@gmail.com",
//     password: "password",
//     cellphone: Cellphone.createFromText("519876543"),
//   });

//   const order = Order.create({
//     customer_id: account.id,
//     payment_method: "PIX",
//     shipping_address: "test address",
//   });

//   order.status = "READY";

//   const orders = await sut.execute({ order_status: "READY" });

//   expect(orders).toHaveLength(1);
//   expect(orders[0].status).toBe("READY");
// });
