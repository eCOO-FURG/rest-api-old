import { NaturalLanguageProcessor } from "@/domain/search/natural-language-processor";
import { env } from "../env";
import { Record } from "@/domain/entities/record";

export class NlpService implements NaturalLanguageProcessor {
  async infer(text: string, limit: number = 10): Promise<Record[]> {
    const inferences = await fetch(
      `${env.NLP_URL}/products/infer?q=${text}&limit=${limit}`,
      {
        method: "GET",
      }
    )
      .then((response: any) => response.json())
      .catch((err: Error) => err);

    const records = inferences.map(
      (inference: { name: string; score: number }) =>
        Record.create({
          name: inference.name,
          score: inference.score,
        })
    );

    return records;
  }
}
