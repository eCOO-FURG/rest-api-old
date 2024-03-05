import { User } from "@/domain/entities/user";

export class UserPresenter {
  static toHttp(user: User) {
    return {
      id: user.id.value,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
    };
  }
}
