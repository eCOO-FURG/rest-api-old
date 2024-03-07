import { Agribusiness } from "@/domain/entities/agribusiness";

export class AgribusinessPresenter {
  static toHttp(agribusinesses: Agribusiness[]) {
    return agribusinesses.map((agribusiness) => ({
      id: agribusiness.id.value,
      name: agribusiness.name,
      caf: agribusiness.caf,
      active: agribusiness.active,
      admin_id: agribusiness.admin_id.value,
      created_at: agribusiness.created_at.toISOString(),
      updated_at: agribusiness.updated_at!.toISOString(),
    }));
  }
}
