import { FavoritesRepository } from '@/domain/ondehoje/application/modules/favorite/repositories/favorites-repository'
import { Favorite } from '@/domain/ondehoje/enterprise/entities/favorite'

export class InMemoryFavoritesRepository implements FavoritesRepository {
  public items: Favorite[] = []

  async findById(id: string): Promise<Favorite | null> {
    const favorite = this.items.find((item) => item.id.toString() === id)

    if (!favorite) {
      return null
    }

    return favorite
  }

  async findMyFavorites(userId: string): Promise<Favorite[]> {
    return this.items.filter((item) => item.userId.toString() === userId)
  }

  async findManyByUserId(userId: string): Promise<Favorite[]> {
    return this.items.filter((item) => item.userId.toString() === userId)
  }

  async create(favorite: Favorite): Promise<void> {
    this.items.push(favorite)
  }

  async delete(favorite: Favorite): Promise<void> {
    const index = this.items.findIndex(
      (f) => f.id.toString() === favorite.id.toString(),
    )
    if (index >= 0) this.items.splice(index, 1)
  }
}
