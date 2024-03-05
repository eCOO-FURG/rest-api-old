import { UUID } from "@/core/entities/uuid";
import { Charge, ChargeProps } from "./charge";

export interface PixProps extends ChargeProps {
  key: string;
  qrcode: string;
  expiration: Date;
}

export class Pix extends Charge<PixProps> {
  get key() {
    return this.props.key;
  }

  get qrcode() {
    return this.props.qrcode;
  }

  get expiration() {
    return this.props.expiration;
  }

  static create(props: PixProps, id?: UUID): Pix {
    const pix = new Pix({ ...props }, id);
    return pix;
  }
}
