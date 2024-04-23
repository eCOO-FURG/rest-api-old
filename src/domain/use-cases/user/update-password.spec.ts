import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { UpdatePasswordUseCase } from "./update-password";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { User } from "@/domain/entities/user";
import { makeUser } from "test/factories/make-user";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { SamePaswordError } from "../errors/same-password-error";

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let sut: UpdatePasswordUseCase;

describe("update password", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    sut = new UpdatePasswordUseCase(inMemoryUsersRepository, fakeHasher);
  });

  it("should be able to update an user password", async () => {
    const user = makeUser();

    await inMemoryUsersRepository.save(user);

    const hashedPassword = await fakeHasher.hash("new-password");

    await sut.execute({
      user_id: user.id.value,
      password: "new-password",
    });

    expect(inMemoryUsersRepository.items[0].password).toEqual(hashedPassword);
  });

  it("should not be able to update an user password for a user that do not exists", async () => {
    await expect(() =>
      sut.execute({
        user_id: "fake-id",
        password: "new-password",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to update an user password with the same password", async () => {
    const hashedPassword = await fakeHasher.hash("new-password");

    const user = makeUser({
      password: hashedPassword,
    });

    await inMemoryUsersRepository.save(user);

    await expect(() =>
      sut.execute({
        user_id: user.id.value,
        password: "new-password",
      })
    ).rejects.toBeInstanceOf(SamePaswordError);
  });
});
