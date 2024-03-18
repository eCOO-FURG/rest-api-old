import { AuthenticateWithOneTimePasswordUseCase } from "@/domain/use-cases/auth/authenticate-with-one-time-password";
import { AuthenticateWithPasswordUseCase } from "@/domain/use-cases/auth/authenticate-with-password";
import { RefreshUseCase } from "@/domain/use-cases/auth/refresh";
import { RegisterSessionUseCase } from "@/domain/use-cases/auth/register-session";
import { VerifyUseCase } from "@/domain/use-cases/auth/verify";
import { GetUserProfileUseCase } from "@/domain/use-cases/get-user-profile";
import { ListCycleUseCase } from "@/domain/use-cases/list-cycles";
import { ListOrdersUseCase } from "@/domain/use-cases/list-orders";
import { OfferProductsUseCase } from "@/domain/use-cases/offer-products";
import { OrderProductsUseCase } from "@/domain/use-cases/order-products";
import { RegisterUseCase } from "@/domain/use-cases/register";
import { RegisterAgribusinessUseCase } from "@/domain/use-cases/register-agribusiness";
import { RegisterCycleUseCase } from "@/domain/use-cases/register-cycle";
import { RegisterOneTimePasswordUseCase } from "@/domain/use-cases/register-one-time-password";
import { SearchOffersUseCase } from "@/domain/use-cases/search-offers";
import { SearchProductsUseCase } from "@/domain/use-cases/search-products";
import { UpdateAgribusinessUseCase } from "@/domain/use-cases/update-agribusiness";
import { UpdateAgribusinessStatusUseCase } from "@/domain/use-cases/update-agribusiness-status";
import { UpdateOrderStatusUseCase } from "@/domain/use-cases/update-order-status";
import { ValidateCycleUseCase } from "@/domain/use-cases/validate-cycle";
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
  validateCycleUseCase: asFunction(
    ({ cyclesRepository }) => new ValidateCycleUseCase(cyclesRepository)
  ),
  offerProductsUseCase: asFunction(
    ({
      validateCycleUseCase,
      agribusinessesRepository,
      offersRepository,
      productsRepository,
    }) =>
      new OfferProductsUseCase(
        validateCycleUseCase,
        agribusinessesRepository,
        offersRepository,
        productsRepository
      )
  ),
  searchOffersUseCase: asFunction(
    ({
      validateCycleUseCase,
      naturalLanguageProcessor,
      productsRepository,
      offersRepository,
    }) =>
      new SearchOffersUseCase(
        validateCycleUseCase,
        naturalLanguageProcessor,
        productsRepository,
        offersRepository
      )
  ),
  orderProductsUseCase: asFunction(
    ({
      validateCycleUseCase,
      usersRepository,
      productsRepository,
      offersRepository,
      ordersRepository,
    }) =>
      new OrderProductsUseCase(
        validateCycleUseCase,
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
