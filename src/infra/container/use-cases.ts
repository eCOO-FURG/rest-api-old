import { AuthenticateUseCase } from "@/domain/use-cases/authenticate";
import { GetUserProfileUseCase } from "@/domain/use-cases/get-user-profile";
import { HandleOrderUseCase } from "@/domain/use-cases/handle-order";
import { OfferProductsUseCase } from "@/domain/use-cases/offer-products";
import { OrderProductsUseCase } from "@/domain/use-cases/order-products";
import { RefreshUseCase } from "@/domain/use-cases/refresh";
import { RegisterUseCase } from "@/domain/use-cases/register";
import { RegisterAgribusinessUseCase } from "@/domain/use-cases/register-agribusiness";
import { SearchOffersUseCase } from "@/domain/use-cases/search-offers";
import { UpdateAgribusinessUseCase } from "@/domain/use-cases/update-agribusiness";
import { UpdateAgribusinessStatusUseCase } from "@/domain/use-cases/update-agribusiness-status";
import { VerifyUseCase } from "@/domain/use-cases/verify";
import { diContainer } from "@fastify/awilix";
import { asFunction, Lifetime } from "awilix";

diContainer.register({
  registerUseCase: asFunction(
    ({ accountsRepository, peopleRepository, hasher }) =>
      new RegisterUseCase(accountsRepository, peopleRepository, hasher),
    {
      lifetime: Lifetime.SCOPED,
    }
  ),
  authenticateUseCase: asFunction(
    ({ accountsRepository, sessionsRepository, hasher, encrypter }) =>
      new AuthenticateUseCase(
        accountsRepository,
        sessionsRepository,
        hasher,
        encrypter
      )
  ),
  getUserProfileUseCase: asFunction(
    ({ accountsRepository, peopleRepository }) =>
      new GetUserProfileUseCase(accountsRepository, peopleRepository)
  ),
  refreshUseCase: asFunction(
    ({ accountsRepository, sessionsRepository, encrypter }) =>
      new RefreshUseCase(accountsRepository, sessionsRepository, encrypter)
  ),
  verifyUseCase: asFunction(
    ({ accountsRepository, encrypter }) =>
      new VerifyUseCase(accountsRepository, encrypter)
  ),
  registerAgribusinessUseCase: asFunction(
    ({ accountsRepository, agribusinessesRepository }) =>
      new RegisterAgribusinessUseCase(
        accountsRepository,
        agribusinessesRepository
      )
  ),
  offerProductsUseCase: asFunction(
    ({
      agribusinessesRepository,
      offersRepository,
      offersProductsRepository,
      productsRepository,
    }) =>
      new OfferProductsUseCase(
        agribusinessesRepository,
        offersRepository,
        offersProductsRepository,
        productsRepository
      )
  ),
  searchOffersUseCase: asFunction(
    ({
      naturalLanguageProcessor,
      productsRepository,
      offersProductsRepository,
    }) =>
      new SearchOffersUseCase(
        naturalLanguageProcessor,
        productsRepository,
        offersProductsRepository
      )
  ),
  orderProductsUseCase: asFunction(
    ({
      productsRepository,
      offersProductsRepository,
      ordersRepository,
      ordersProductsRepository,
      paymentsProcessor,
      accountsRepository,
    }) =>
      new OrderProductsUseCase(
        productsRepository,
        offersProductsRepository,
        ordersRepository,
        ordersProductsRepository,
        paymentsProcessor,
        accountsRepository
      )
  ),
  handleOrderUseCase: asFunction(
    ({
      ordersRepository,
      ordersProductsRepository,
      offersProductsRepository,
    }) =>
      new HandleOrderUseCase(
        ordersRepository,
        ordersProductsRepository,
        offersProductsRepository
      )
  ),
  updateAgribusinessUseCase: asFunction(
    ({ agribusinessesRepository }) =>
      new UpdateAgribusinessUseCase(agribusinessesRepository),
    {
      lifetime: Lifetime.SCOPED,
    }
  ),
  updateAgribusinessStatusUseCase: asFunction(
    ({ agribusinessesRepository }) =>
      new UpdateAgribusinessStatusUseCase(agribusinessesRepository),
    {
      lifetime: Lifetime.SCOPED,
    }
  ),
});
