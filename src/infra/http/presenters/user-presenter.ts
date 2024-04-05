import { User } from "@/domain/entities/user";

export class UserPresenter {
  static toHttp(user: User) {
    return {
      id: user.id.value,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      roles: user.roles,
    };
  }
}
