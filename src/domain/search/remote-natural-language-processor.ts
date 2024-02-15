export interface RemoteNaturalLanguageProcessor {
  infer(
    text: string,
    collection: string,
    limit?: number
  ): Promise<[{ name: string; score: string }]>;
}
