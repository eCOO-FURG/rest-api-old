import { FastifyInstance } from "fastify";
import { register } from "./register";
import { authenticateWithPassword } from "./authenticate-with-password";
import { getUserProfile } from "./get-user-profile";
import { ensureAuthenticated } from "../middlewares/ensure-authenticated";
import { refresh } from "./refresh";
import { verify } from "./verify";
import { offerProducts } from "./offer-products";
import { registerAgribusiness } from "./register-agribusiness";
import { ensureAgribusinessAdmin } from "../middlewares/ensure-agribusiness-admin";
import { searchOffers } from "./search-offers";
import { orderProducts } from "./order-products";
import { updateAgribusiness } from "./update-agribusiness";
import { updateAgribusinessStatus } from "./update-agribusiness-status";
import { ensureAdministrator } from "../middlewares/ensure-administrator";
import { registerOneTimePassword } from "./register-one-time-password";
import { authenticateWithOneTimePassword } from "./authenticate-with-one-time-password";
import { registerCycle } from "./register-cycle";
import { searchProducts } from "./search-products";
import { listCycles } from "./list-cycles";
import { listOrders } from "./list-orders";
import { viewOrder } from "./view-order";
import { updateOrderStatus } from "./update-order-status";
import { requestPasswordUpdate } from "./request-password-update";
import { updatePassword } from "./update-password";

export async function routes(app: FastifyInstance) {
  app.post("/users", register);
  app.get("/users/verify", verify);
  app.post("/users/otp", registerOneTimePassword);
  app.get("/users/password", requestPasswordUpdate);
  app.patch(
    "/users/password",
    {
      onRequest: [ensureAuthenticated],
    },
    updatePassword
  );

  app.post("/auth", authenticateWithPassword);
  app.post("/auth/otp", authenticateWithOneTimePassword);
  app.post("/auth/refresh", refresh);

  app.post(
    "/agribusinesses",
    {
      onRequest: [ensureAuthenticated],
    },
    registerAgribusiness
  );

  app.post(
    "/offers",
    {
      onRequest: [ensureAuthenticated, ensureAgribusinessAdmin],
    },
    offerProducts
  );
  app.get("/offers", searchOffers);

  app.get(
    "/me",
    {
      onRequest: [ensureAuthenticated],
    },
    getUserProfile
  );

  app.post(
    "/orders",
    {
      onRequest: [ensureAuthenticated],
    },
    orderProducts
  );

  app.patch(
    "/agribusiness",
    {
      onRequest: [ensureAuthenticated, ensureAgribusinessAdmin],
    },
    updateAgribusiness
  );

  app.get(
    "/agribusiness/:agribusiness_id",
    {
      onRequest: [ensureAuthenticated, ensureAdministrator],
    },
    updateAgribusinessStatus
  );

  app.post(
    "/cycles",
    {
      onRequest: [ensureAuthenticated, ensureAdministrator],
    },
    registerCycle
  );

  app.get(
    "/products",
    {
      onRequest: [ensureAuthenticated, ensureAgribusinessAdmin],
    },
    searchProducts
  );

  app.get("/cycles", listCycles);

  app.get(
    "/orders",
    {
      onRequest: [ensureAuthenticated, ensureAdministrator],
    },
    listOrders
  );

  app.get(
    "/orders/:order_id",
    {
      onRequest: [ensureAuthenticated, ensureAdministrator],
    },
    viewOrder
  );

  app.post(
    "/orders/:order_id",
    {
      onRequest: [ensureAuthenticated, ensureAdministrator],
    },
    updateOrderStatus
  );
}
