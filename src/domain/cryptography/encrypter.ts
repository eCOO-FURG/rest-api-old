export interface Encrypter {
  encrypt(payload: Record<string, string>): Promise<string>;
  decode(value: string): Promise<Record<string, string>>;
}
