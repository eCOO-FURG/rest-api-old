import { env } from "@/infra/env";
import { RemoteNaturalLanguageProcessor } from "@/domain/search/remote-natural-language-processor";

export class NlpService implements RemoteNaturalLanguageProcessor {
  async infer(text: string, collection: string, limit: number = 10) {
    const inferences = await fetch(
      `${env.NLP_URL}/${collection}/infer?q=${text}&limit=${limit}`,
      {
        method: "GET",
      }
    )
      .then((response: any) => response.json())
      .catch((err: Error) => err);

    return inferences;
  }
}
