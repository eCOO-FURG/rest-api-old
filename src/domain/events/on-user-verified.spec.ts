import { FakePaymentsProcessor } from "test/payments/fake-payment-processor";
import { OnUserVerified } from "./on-user-verified";
import { VerifyUseCase } from "../use-cases/auth/verify";
import { waitFor } from "test/utils/wait-for";
import { SpyInstance } from "vitest";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { User } from "../entities/user";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeEncrypter: FakeEncrypter;
let fakePaymentsProcessor: FakePaymentsProcessor;
let fakePaymentsProcessorSpy: SpyInstance;
let verifiyUseCase: VerifyUseCase;

describe("on user verified", () => {
  beforeEach(() => {
    fakeEncrypter = new FakeEncrypter();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeEncrypter = new FakeEncrypter();
    verifiyUseCase = new VerifyUseCase(inMemoryUsersRepository, fakeEncrypter);

    fakePaymentsProcessor = new FakePaymentsProcessor();
    fakePaymentsProcessorSpy = vi.spyOn(fakePaymentsProcessor, "register");

    new OnUserVerified(fakePaymentsProcessor);
  });

  it("should register a new customer on payments processor gateway when a user is verified", async () => {
    const user = User.create({
      email: "test@gmail.com",
      phone: "51987654321",
      password: "123456",
      first_name: "John",
      last_name: "Doe",
      cpf: "523.065.281-01",
    });

    await inMemoryUsersRepository.save(user);

    const code = await fakeEncrypter.encrypt({ user_id: user.id.value });

    await verifiyUseCase.execute({
      code,
    });

    await waitFor(() => {
      expect(fakePaymentsProcessorSpy).toHaveBeenCalled();
    });
  });
});
