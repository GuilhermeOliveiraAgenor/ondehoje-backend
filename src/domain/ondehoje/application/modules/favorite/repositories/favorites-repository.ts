import { Favorite } from '@/domain/ondehoje/enterprise/entities/favorite'

export abstract class FavoritesRepository {
  abstract findById(id: string): Promise<Favorite | null>
  abstract findMyFavorites(userId: string): Promise<Favorite[]>
  abstract findManyByUserId(userId: string): Promise<Favorite[]>
  abstract create(favorite: Favorite): Promise<void>
  abstract delete(favorite: Favorite): Promise<void>
}
