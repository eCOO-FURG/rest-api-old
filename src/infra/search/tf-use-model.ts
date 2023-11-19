import { NaturalLanguageProcessor } from "@/domain/search/natural-language-processor";
import * as UniversalSentenceEncoder from "@tensorflow-models/universal-sentence-encoder";

export class TfUseModel implements NaturalLanguageProcessor {
  private model!: UniversalSentenceEncoder.UniversalSentenceEncoder;

  async init() {
    this.model = await UniversalSentenceEncoder.load();
  }

  async embed(value: string): Promise<number[]> {
    return Array.from((await this.model.embed(value)).dataSync());
  }
}
