import { OfferWithAgribusiness } from "@/domain/entities/value-objects/offer-with-agribusiness";

export class OfferWithAgribusinessPresenter {
  static toHttp(offer: OfferWithAgribusiness) {
    return {
      id: offer.agribusiness.id.value,
      name: offer.agribusiness.name,
      active: offer.agribusiness.active,
      offer: {
        id: offer.id.value,
        products: offer.items.map((item) => ({
          id: item.product.id.value,
          amount: item.amount,
          price: item.price,
          name: item.product.name,
          image: item.product.name,
          pricing: item.product.pricing,
          description: item.description,
          created_at: item.created_at,
          updated_at: item.updated_at,
        })),
        created_at: offer.created_at,
        updated_at: offer.updated_at,
      },
      created_at: offer.agribusiness.created_at,
      updated_at: offer.agribusiness.updated_at,
    };
  }
}
