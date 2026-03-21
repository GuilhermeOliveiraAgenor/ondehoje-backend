import { UserImagesRepository } from '@/domain/ondehoje/application/modules/user-image/repositories/user-images-repository'
import { UserImage } from '@/domain/ondehoje/enterprise/entities/user-image'

export class InMemoryUserImagesRepository implements UserImagesRepository {
  public items: UserImage[] = []

  async findManyByUserId(userId: string): Promise<UserImage[]> {
    const userImages = this.items.filter(
      (item) => item.userId.toString() === userId,
    )

    return userImages
  }

  async createMany(images: UserImage[]): Promise<void> {
    this.items.push(...images)
  }

  async deleteMany(images: UserImage[]): Promise<void> {
    const userImages = this.items.filter((item) => {
      return !images.some((image) => image.equals(item))
    })

    this.items = userImages
  }

  async deleteManyByUserId(userId: string): Promise<void> {
    const userImages = this.items.filter(
      (item) => item.userId.toString() !== userId,
    )

    this.items = userImages
  }
}
