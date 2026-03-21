import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  EventImage,
  EventImageProps,
} from '@/domain/ondehoje/enterprise/entities/event-image'
import { PrismaEventImageMapper } from '@/infra/database/prisma/mappers/prisma-event-image-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeEventImage(
  override: Partial<EventImage> = {},
  id?: UniqueEntityID,
) {
  const eventImage = EventImage.create(
    {
      imageId: new UniqueEntityID(),
      eventId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return eventImage
}

@Injectable()
export class EventImageFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaEventImage(
    data: Partial<EventImageProps> = {},
  ): Promise<EventImage> {
    const eventImage = makeEventImage(data)

    await this.prisma.eventImage.createMany(
      PrismaEventImageMapper.toPersistencyMany([eventImage]),
    )

    return eventImage
  }
}
