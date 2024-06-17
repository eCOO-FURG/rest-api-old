import { Entity, EntityProps } from "@/core/entities/entity";
import { Optional } from "@/core/types/optional";

interface RedirectProps extends Optional<EntityProps, "created_at"> {
  url: string;
}

export class Redirect extends Entity<RedirectProps, string> {
  get url() {
    return this.props.url;
  }

  set url(url: RedirectProps["url"]) {
    this.props.url = url;
  }

  static create(props: RedirectProps, id: string) {
    const redirect = new Redirect({ ...props }, id);

    return redirect;
  }
}
