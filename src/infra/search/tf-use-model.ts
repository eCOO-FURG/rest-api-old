import { NaturalLanguageProcessor } from "@/domain/search/natural-language-processor";
import { UniversalSentenceEncoder } from "@tensorflow-models/universal-sentence-encoder";

export class TfUseModel implements NaturalLanguageProcessor {
  constructor(private model: UniversalSentenceEncoder) {}

  async embed(value: string): Promise<number[]> {
    return Array.from((await this.model.embed(value)).dataSync());
  }
}
