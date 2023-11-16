export interface NaturalLanguageProcessor {
  embed(value: string): Promise<number[]>;
}
