import { Views } from "./views";

export interface ViewLoader {
  load(view: keyof typeof Views, props: unknown): Promise<string>;
}
