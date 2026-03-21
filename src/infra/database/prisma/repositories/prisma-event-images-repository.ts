import { Injectable } from '@nestjs/common'

import { EventImagesRepository } from '@/domain/ondehoje/application/modules/event-image/repositories/event-images-repository'
import { EventImage } from '@/domain/ondehoje/enterprise/entities/event-image'

import { PrismaEventImageMapper } from '../mappers/prisma-event-image-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaEventImagesRepository implements EventImagesRepository {
  constructor(private prisma: PrismaService) {}

  async findManyByEventId(eventId: string): Promise<EventImage[]> {
    const [eventImages] = await this.prisma.$transaction([
      this.prisma.eventImage.findMany({
        where: {
          eventId,
        },
      }),
    ])

    return eventImages.map(PrismaEventImageMapper.toDomain)
  }

  async createMany(images: EventImage[]): Promise<void> {
    if (images.length === 0) {
      return
    }

    const data = PrismaEventImageMapper.toPersistencyMany(images)

    await this.prisma.$transaction([this.prisma.eventImage.createMany(data)])
  }

  async deleteMany(images: EventImage[]): Promise<void> {
    if (images.length === 0) {
      return
    }

    const eventImagesToDelete = images.map((eventImage) => {
      return {
        eventId: eventImage.eventId.toString(),
        imageId: eventImage.imageId.toString(),
      }
    })

    await this.prisma.$transaction([
      this.prisma.eventImage.deleteMany({
        where: {
          OR: eventImagesToDelete,
        },
      }),
    ])

    await this.prisma.$transaction([
      this.prisma.image.deleteMany({
        where: {
          id: {
            in: images.map((image) => image.imageId.toString()),
          },
        },
      }),
    ])
  }

  async deleteManyByEventId(eventId: string): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.eventImage.deleteMany({
        where: {
          eventId,
        },
      }),
    ])
  }
}
