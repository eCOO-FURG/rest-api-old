import { Record } from "../entities/record";

export interface NaturalLanguageProcessor {
  infer(text: string, limit?: number): Promise<Record[]>;
}
