import { EventImage } from '@/domain/ondehoje/enterprise/entities/event-image'

export abstract class EventImagesRepository {
  abstract findManyByEventId(eventId: string): Promise<EventImage[]>
  abstract createMany(images: EventImage[]): Promise<void>
  abstract deleteMany(images: EventImage[]): Promise<void>
  abstract deleteManyByEventId(eventId: string): Promise<void>
}
