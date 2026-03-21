import { ImagesRepository } from '@/domain/ondehoje/application/modules/image/repositories/images-repository'
import { Image } from '@/domain/ondehoje/enterprise/entities/image'

export class InMemoryImagesRepository implements ImagesRepository {
  public items: Image[] = []

  async createMany(images: Image[]): Promise<void> {
    this.items.push(...images)
  }
}
