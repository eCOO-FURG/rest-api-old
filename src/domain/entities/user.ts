import { Entity, EntityProps } from "@/core/entities/entity";
import { UUID } from "@/core/entities/uuid";
import { Optional } from "@/core/types/optional";
import { UserVerifiedEvent } from "../events/on-user-verified";
import { UserRegisteredEvent } from "../events/on-user-registered";

type Role = "USER" | "PRODUCER" | "ADMIN";

interface UserProps extends Optional<EntityProps, "created_at"> {
  first_name: string;
  last_name: string;
  email: string;
  password: string | null;
  cpf: string;
  phone: string;
  roles: Role[];
  verified_at: Date | null;
}

export class User extends Entity<UserProps> {
  get first_name() {
    return this.props.first_name;
  }

  set first_name(first_name: string) {
    this.props.first_name = first_name;
  }

  get last_name() {
    return this.props.last_name;
  }

  set last_name(last_name: string) {
    this.props.last_name = last_name;
  }

  get email() {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
  }

  get password(): string | null {
    return this.props.password;
  }

  set password(value: string) {
    this.props.password = value;
  }

  protect(password: string) {
    this.props.password = password;
  }

  get cpf() {
    return this.props.cpf;
  }

  set cpf(cpf: string) {
    this.props.cpf = cpf;
  }

  get phone() {
    return this.props.phone;
  }

  set phone(phone: string) {
    this.props.phone = phone;
  }

  get verified_at() {
    return this.props.verified_at;
  }

  verify() {
    this.props.verified_at = new Date();
    this.registerEvent(new UserVerifiedEvent(this));
    this.touch();
  }

  get roles() {
    return this.props.roles;
  }

  set roles(roles: Role[]) {
    this.props.roles = roles;
  }

  static create(
    props: Optional<UserProps, "roles" | "password" | "verified_at">,
    id?: UUID
  ) {
    const user = new User(
      {
        ...props,
        roles: props.roles ?? ["USER"],
        password: props.password ?? null,
        verified_at: props.verified_at ?? null,
      },
      id
    );

    if (!id) {
      user.registerEvent(new UserRegisteredEvent(user));
    }

    return user;
  }
}
