import { Redirect } from "../entities/redirect";

export interface RedirectsRepository {
  save(session: Redirect): Promise<void>;
  findById(id: Redirect["id"]): Promise<Redirect | null>;
  delete(id: Redirect["id"]): Promise<void>;
}
