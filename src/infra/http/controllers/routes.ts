// Core
import { FastifyInstance } from "fastify";

// Controllers
import { authenticate } from "@/infra/http/controllers/authenticate";
import { register } from "@/infra/http/controllers/register";
import { getUserProfile } from "@/infra/http/controllers/get-user-profile";
import { ensureAuthenticated } from "../middlewares/ensure-authenticated";
import { refresh } from "@/infra/http/controllers/refresh";
import { verify } from "@/infra/http/controllers/verify";
import { offerProducts } from "@/infra/http/controllers/offer-products";
import { registerAgribusiness } from "@/infra/http/controllers/register-agribusiness";
import { ensureAgribusinessAdmin } from "../middlewares/ensure-agribusiness-admin";
import { searchOffers } from "@/infra/http/controllers/search-offers";
import { orderProducts } from "@/infra/http/controllers/order-products";
import { updateAgribusiness } from "@/infra/http/controllers/update-agribusiness";
import { updateAgribusinessStatus } from "@/infra/http/controllers/update-agribusiness-status";
import { ensureAdministrator } from "../middlewares/ensure-administrator";
import { registerOneTimePassword } from "@/infra/http/controllers/register-one-time-password";
import { registerCycle } from "@/infra/http/controllers/register-cycle";
import { searchProducts } from "@/infra/http/controllers/search-products";
import { listCycles } from "@/infra/http/controllers/list-cycles";
import { listOrders } from "@/infra/http/controllers/list-orders";
import { viewOrder } from "@/infra/http/controllers/view-order";
import { updateOrderStatus } from "@/infra/http/controllers/update-order-status";
import { requestPasswordUpdate } from "@/infra/http/controllers/request-password-update";
import { updatePassword } from "@/infra/http/controllers/update-password";

export async function routes(app: FastifyInstance) {
  app.post("/auth", authenticate);

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
