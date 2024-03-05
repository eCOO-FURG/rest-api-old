// import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
// import { OrdersRepository } from "../repositories/orders-repository";
// import { getDayOfTheWeek } from "../utils/get-day-of-the-week";
// import { OrdersProductsRepository } from "../repositories/orders-products-repository";
// import { OffersProductsRepository } from "../repositories/offers-products-repository";

// interface HandleOrderUseCaseRequest {
//   order_id: string;
//   event: "PAYMENT_RECEIVED" | "PAYMENT_OVERDUE";
// }

// export class HandleOrderUseCase {
//   constructor(
//     private ordersRepository: OrdersRepository,
//     private ordersProductsrRepository: OrdersProductsRepository,
//     private offersProductsRepository: OffersProductsRepository
//   ) {}

//   async execute({ order_id, event }: HandleOrderUseCaseRequest) {
//     const order = await this.ordersRepository.findById(order_id);

//     if (!order) {
//       throw new ResourceNotFoundError(order_id);
//     }

//     switch (event) {
//       case "PAYMENT_RECEIVED":
//         const today = getDayOfTheWeek();

//         order.status = today in ["thursday", "friday"] ? "ON_HOLD" : "READY";

//         await this.ordersRepository.update(order);
//         break;
//       case "PAYMENT_OVERDUE":
//         const orderProducts =
//           await this.ordersProductsrRepository.findManyByOrderId(order_id);

//         const offersProductsIds = orderProducts.map((orderProduct) =>
//           orderProduct.offer_product_id.toString()
//         );

//         const offersProducts =
//           await this.offersProductsRepository.findManyByIds(offersProductsIds);

//         const rolledbackOffersProducts = orderProducts.map((orderProduct) => {
//           const offerProductIndex = offersProducts.findIndex(
//             (offerProduct) =>
//               offerProduct.id.equals(orderProduct.offer_product_id) &&
//               offerProduct.product_id.equals(orderProduct.product_id)
//           );
//           offersProducts[offerProductIndex].quantity_or_weight +=
//             orderProduct.quantity_or_weight;

//           return offersProducts[offerProductIndex];
//         });

//         await this.offersProductsRepository.update(rolledbackOffersProducts);

//         order.status = "CANCELED";

//         await this.ordersRepository.update(order);
//         break;
//     }
//   }
// }
