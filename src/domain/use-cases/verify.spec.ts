import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { VerifyUseCase } from "./verify";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { User } from "../entities/user";

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeEncrypter: FakeEncrypter;
let sut: VerifyUseCase;

describe("verify", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeEncrypter = new FakeEncrypter();
    sut = new VerifyUseCase(inMemoryUsersRepository, fakeEncrypter);
  });

  it("should be able to verify an account", async () => {
    const user = User.create({
      email: "test@gmail.com",
      phone: "51987654321",
      password: "123456",
      first_name: "John",
      last_name: "Doe",
      cpf: "523.065.281-01",
    });

    await inMemoryUsersRepository.save(user);

    await sut.execute({
      code: await fakeEncrypter.encrypt({ user_id: user.id.value }),
    });

    expect(inMemoryUsersRepository.items[0].verified_at).toBeInstanceOf(Date);
  });

  it("should not be able to verify an account twice", async () => {});
});
