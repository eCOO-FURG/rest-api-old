import { Record } from "@/domain/entities/record";
import { NaturalLanguageProcessor } from "@/domain/search/natural-language-processor";

export class FakeNaturalLanguageProcessor implements NaturalLanguageProcessor {
  items: Record[] = [];

  async infer(text: string, limit: number = 10): Promise<Record[]> {
    const records = this.items.filter((item) => item.name.includes(text));

    return records.slice(0, limit - 1);
  }

  async save(record: Record) {
    this.items.push(record);
  }
}
