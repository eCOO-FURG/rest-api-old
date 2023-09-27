export abstract class HashService {
  abstract hash(plain: string): Promise<string>;
}
