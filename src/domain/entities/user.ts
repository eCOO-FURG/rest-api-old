import { Entity, EntityProps } from "@/core/entities/entity";
import { UUID } from "@/core/entities/uuid";
import { Optional } from "@/core/types/optional";
import { UserVerifiedEvent } from "../events/on-user-verified";

interface UserProps extends Optional<EntityProps, "created_at"> {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
  verified_at?: Date;
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

  get password() {
    return this.props.password;
  }

  set password(password: string) {
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

  static create(props: UserProps, id?: UUID) {
    const user = new User(props, id);
    return user;
  }
}
