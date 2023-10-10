import { ViewLoader } from "@/domain/mail/view-loader";
import { Views } from "@/domain/mail/views";
import { renderFile } from "ejs";

export class EjsLoader implements ViewLoader {
  load(view: keyof typeof Views, props: unknown): Promise<string> {
    const html = renderFile(__dirname + `/views/${Views[view]}.ejs`, {
      props,
    });

    return html;
  }
}
