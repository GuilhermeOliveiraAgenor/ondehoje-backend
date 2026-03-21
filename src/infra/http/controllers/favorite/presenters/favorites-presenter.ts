import { Favorite } from '@/domain/ondehoje/enterprise/entities/favorite'

export class FavoritesPresenter {
  static toHTTP(raw: Favorite) {
    return {
      id: raw.id.toString(),
      eventId: raw.eventId || null,
      companyId: raw.companyId || null,
      userId: raw.userId,
      createdAt: raw.createdAt,
    }
  }
}
