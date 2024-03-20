import { AuthenticateWithOneTimePasswordUseCase } from "@/domain/use-cases/auth/authenticate-with-one-time-password";
import { AuthenticateWithPasswordUseCase } from "@/domain/use-cases/auth/authenticate-with-password";
import { RefreshUseCase } from "@/domain/use-cases/auth/refresh";
import { RegisterOneTimePasswordUseCase } from "@/domain/use-cases/auth/register-one-time-password";
import { RegisterSessionUseCase } from "@/domain/use-cases/auth/register-session";
import { VerifyUseCase } from "@/domain/use-cases/auth/verify";
import { ListCycleUseCase } from "@/domain/use-cases/market/list-cycles";
import { ListOrdersUseCase } from "@/domain/use-cases/market/list-orders";
import { OfferProductsUseCase } from "@/domain/use-cases/market/offer-products";
import { RegisterAgribusinessUseCase } from "@/domain/use-cases/market/register-agribusiness";
import { RegisterCycleUseCase } from "@/domain/use-cases/market/register-cycle";
import { SearchProductsUseCase } from "@/domain/use-cases/market/search-products";
import { UpdateAgribusinessUseCase } from "@/domain/use-cases/market/update-agribusiness";
import { UpdateAgribusinessStatusUseCase } from "@/domain/use-cases/market/update-agribusiness-status";
import { UpdateOrderStatusUseCase } from "@/domain/use-cases/market/update-order-status";
import { ValidateCycleActionUseCase } from "@/domain/use-cases/market/validate-cycle-action";
import { GetUserProfileUseCase } from "@/domain/use-cases/user/get-user-profile";
import { OrderProductsUseCase } from "@/domain/use-cases/user/order-products";
import { RegisterUseCase } from "@/domain/use-cases/user/register";
import { SearchOffersUseCase } from "@/domain/use-cases/user/search-offers";
import { ViewOrderUseCase } from "@/domain/use-cases/view-order";
import { diContainer } from "@fastify/awilix";
import { asFunction, Lifetime } from "awilix";

diContainer.register({
  registerUseCase: asFunction(
    ({ usersRepository, hasher }) =>
      new RegisterUseCase(usersRepository, hasher),
    {
      lifetime: Lifetime.SCOPED,
    }
  ),
  registerSessionUseCase: asFunction(
    ({ sessionsRepository, encrypter }) =>
      new RegisterSessionUseCase(sessionsRepository, encrypter)
  ),
  authenticateWithPasswordUseCase: asFunction(
    ({ usersRepository, hasher, registerSessionUseCase }) =>
      new AuthenticateWithPasswordUseCase(
        usersRepository,
        hasher,
        registerSessionUseCase
      )
  ),
  authenticateWithOneTimePasswordUseCase: asFunction(
    ({ usersRepository, oneTimePasswordsRepository, registerSessionUseCase }) =>
      new AuthenticateWithOneTimePasswordUseCase(
        usersRepository,
        oneTimePasswordsRepository,
        registerSessionUseCase
      )
  ),
  getUserProfileUseCase: asFunction(
    ({ usersRepository }) => new GetUserProfileUseCase(usersRepository)
  ),
  refreshUseCase: asFunction(
    ({ usersRepository, sessionsRepository, encrypter }) =>
      new RefreshUseCase(usersRepository, sessionsRepository, encrypter)
  ),
  verifyUseCase: asFunction(
    ({ usersRepository, encrypter }) =>
      new VerifyUseCase(usersRepository, encrypter)
  ),
  registerAgribusinessUseCase: asFunction(
    ({ usersRepository, agribusinessesRepository }) =>
      new RegisterAgribusinessUseCase(usersRepository, agribusinessesRepository)
  ),
  validateCycleActionUseCase: asFunction(
    ({ cyclesRepository }) => new ValidateCycleActionUseCase(cyclesRepository)
  ),
  offerProductsUseCase: asFunction(
    ({
      validateCycleActionUseCase,
      agribusinessesRepository,
      offersRepository,
      productsRepository,
    }) =>
      new OfferProductsUseCase(
        validateCycleActionUseCase,
        agribusinessesRepository,
        offersRepository,
        productsRepository
      )
  ),
  searchOffersUseCase: asFunction(
    ({ validateCycleActionUseCase, productsRepository, offersRepository }) =>
      new SearchOffersUseCase(
        validateCycleActionUseCase,
        productsRepository,
        offersRepository
      )
  ),
  orderProductsUseCase: asFunction(
    ({
      validateCycleActionUseCase,
      usersRepository,
      productsRepository,
      offersRepository,
      ordersRepository,
    }) =>
      new OrderProductsUseCase(
        validateCycleActionUseCase,
        usersRepository,
        productsRepository,
        offersRepository,
        ordersRepository
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
  registerOneTimePasswordUseCase: asFunction(
    ({ usersRepository, otpGenerator, oneTimePasswordsRepository }) =>
      new RegisterOneTimePasswordUseCase(
        usersRepository,
        otpGenerator,
        oneTimePasswordsRepository
      )
  ),
  registerCycleUseCase: asFunction(
    ({ cyclesRepository }) => new RegisterCycleUseCase(cyclesRepository)
  ),
  searchProductsUseCase: asFunction(
    ({ productsRepository }) => new SearchProductsUseCase(productsRepository)
  ),
  listCyclesUseCase: asFunction(
    ({ cyclesRepository }) => new ListCycleUseCase(cyclesRepository)
  ),
  listOrdersUseCase: asFunction(
    ({ cyclesRepository, ordersRepository }) =>
      new ListOrdersUseCase(cyclesRepository, ordersRepository)
  ),
  viewOrderUseCase: asFunction(
    ({
      ordersRepository,
      usersRepository,
      offersRepository,
      productsRepository,
      agribusinessesRepository,
    }) =>
      new ViewOrderUseCase(
        ordersRepository,
        usersRepository,
        offersRepository,
        productsRepository,
        agribusinessesRepository
      )
  ),
  updateOrderStatusUseCase: asFunction(
    ({ ordersRepository }) => new UpdateOrderStatusUseCase(ordersRepository)
  ),
});
