import { ViewLoader } from "@/domain/mail/view-loader";
import { Views } from "@/domain/mail/views";

export class FakeViewLoader implements ViewLoader {
  async load(view: keyof typeof Views, props: unknown): Promise<string> {
    return `Email: ${view} \n Props: ${props}`;
  }
}
