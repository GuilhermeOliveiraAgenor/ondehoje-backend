import { EventImagesRepository } from '@/domain/ondehoje/application/modules/event-image/repositories/event-images-repository'
import { EventImage } from '@/domain/ondehoje/enterprise/entities/event-image'

export class InMemoryEventImagesRepository implements EventImagesRepository {
  public items: EventImage[] = []

  async findManyByEventId(eventId: string): Promise<EventImage[]> {
    const eventImages = this.items.filter(
      (item) => item.eventId.toString() === eventId,
    )

    return eventImages
  }

  async createMany(images: EventImage[]): Promise<void> {
    this.items.push(...images)
  }

  async deleteMany(images: EventImage[]): Promise<void> {
    const eventImages = this.items.filter((item) => {
      return !images.some((image) => image.equals(item))
    })

    this.items = eventImages
  }

  async deleteManyByEventId(eventId: string): Promise<void> {
    const eventImages = this.items.filter(
      (item) => item.eventId.toString() !== eventId,
    )

    this.items = eventImages
  }
}
