import { OnUserRegistered } from "@/domain/events/on-user-registered";
import { diContainer } from "@fastify/awilix";
import { asFunction } from "awilix";

diContainer.register({
  onUserRegistered: asFunction(
    ({ sendEmailUseCase, peopleRepository, encrypter, viewLoader }) =>
      new OnUserRegistered(
        sendEmailUseCase,
        peopleRepository,
        encrypter,
        viewLoader
      )
  ),
});
