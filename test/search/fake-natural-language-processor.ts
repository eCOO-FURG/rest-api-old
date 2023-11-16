import { NaturalLanguageProcessor } from "@/domain/search/natural-language-processor";

export class FakeNaturalLanguageProcessor implements NaturalLanguageProcessor {
  async embed(value: string): Promise<number[]> {
    const embeeding: number[] = [];

    for (const _ of value) {
      embeeding.push(1);
    }

    return embeeding;
  }
}
