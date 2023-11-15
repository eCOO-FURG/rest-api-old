export interface NaturalLanguageProcessor {
  embeed(value: string): Promise<number[]>;
}
