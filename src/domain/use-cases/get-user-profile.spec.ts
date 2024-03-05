import { GetUserProfileUseCase } from "./get-user-profile";
import { User } from "../entities/user";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe("get user profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(inMemoryUsersRepository);
  });

  it("should be able to get a user profile by the user id", async () => {
    const user = User.create({
      email: "johndoe@example.com",
      phone: "51987654321",
      password: "12345678",
      first_name: "John",
      last_name: "Doe",
      cpf: "523.065.281-01",
      verified_at: new Date(),
    });

    await inMemoryUsersRepository.save(user);

    const result = await sut.execute({
      user_id: user.id.value,
    });

    expect(result).toHaveProperty("user");
  });

  it("should not be able to get a non existent user profile", async () => {
    await expect(async () =>
      sut.execute({
        user_id: "user-id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
