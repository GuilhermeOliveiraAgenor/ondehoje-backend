import { EventImage as PrismaEventImage, type Prisma } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EventImage } from '@/domain/ondehoje/enterprise/entities/event-image'

export class PrismaEventImageMapper {
  static toDomain(raw: PrismaEventImage): EventImage {
    return EventImage.create({
      eventId: new UniqueEntityID(raw.eventId),
      imageId: new UniqueEntityID(raw.imageId),
    })
  }

  static toPersistencyMany(raw: EventImage[]): Prisma.EventImageCreateManyArgs {
    return {
      data: raw.map((raw) => ({
        eventId: raw.eventId.toString(),
        imageId: raw.imageId.toString(),
      })),
      skipDuplicates: true,
    }
  }
}
