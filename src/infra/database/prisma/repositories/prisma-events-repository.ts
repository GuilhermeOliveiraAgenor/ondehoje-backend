import { Injectable } from '@nestjs/common'

import { AdvertisementStatus } from '@/domain/ondehoje/application/modules/advertisement/enums/advertisement-status'
import { AdvertisementAuthorizationStatus } from '@/domain/ondehoje/application/modules/advertisement-authorization/enums/advertisement-authorization-status'
import {
  EventsRepository,
  type FindManyEventsParams,
} from '@/domain/ondehoje/application/modules/event/repositories/events-repository'
import { EventImagesRepository } from '@/domain/ondehoje/application/modules/event-image/repositories/event-images-repository'
import {
  type Coordinate,
  getDistanceBetweenCoordinates,
} from '@/domain/ondehoje/application/utils/get-distance-between-coordinates'
import { Event } from '@/domain/ondehoje/enterprise/entities/event'
import type { EventDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/event-details'

import { PrismaEventDetailsMapper } from '../mappers/prisma-event-details-mapper'
import { PrismaEventMapper } from '../mappers/prisma-event-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaEventsRepository implements EventsRepository {
  constructor(
    private prisma: PrismaService,
    private eventImagesRepository: EventImagesRepository,
  ) {}

  async findById(id: string): Promise<Event | null> {
    const [event] = await this.prisma.$transaction([
      this.prisma.event.findUnique({
        where: {
          id,
        },
      }),
    ])

    if (!event) {
      return null
    }

    return PrismaEventMapper.toDomain(event)
  }

  async findBySlugAndCompanyId(
    slug: string,
    companyId: string,
  ): Promise<Event | null> {
    const [event] = await this.prisma.$transaction([
      this.prisma.event.findUnique({
        where: {
          companyId_slug: {
            companyId,
            slug,
          },
        },
      }),
    ])

    if (!event) {
      return null
    }

    return PrismaEventMapper.toDomain(event)
  }

  async findDetails(slug: string): Promise<EventDetails | null> {
    const [event] = await this.prisma.$transaction([
      this.prisma.event.findFirst({
        where: {
          slug,
        },
        include: {
          company: {
            include: {
              address: true,
              companyDocuments: {
                include: {
                  document: true,
                },
              },
              companyImages: {
                include: {
                  image: true,
                },
              },
              informations: {
                where: {
                  eventId: null,
                },
              },
            },
          },
          address: true,
          category: true,
          informations: true,
          eventImages: {
            include: {
              image: true,
            },
          },
        },
      }),
    ])

    if (!event) {
      return null
    }

    return PrismaEventDetailsMapper.toDomain(event)
  }

  async findManyByCompanyId(companyId: string): Promise<EventDetails[]> {
    const [events] = await this.prisma.$transaction([
      this.prisma.event.findMany({
        where: {
          companyId,
        },
        include: {
          company: {
            include: {
              address: true,
              companyDocuments: {
                include: {
                  document: true,
                },
              },
              companyImages: {
                include: {
                  image: true,
                },
              },
              informations: {
                where: {
                  eventId: null,
                },
              },
            },
          },
          address: true,
          category: true,
          informations: true,
          eventImages: {
            include: {
              image: true,
            },
          },
        },
      }),
    ])

    return events.map(PrismaEventDetailsMapper.toDomain)
  }

  async findMany(params?: FindManyEventsParams): Promise<EventDetails[]> {
    const now = new Date()
    const { latitude, longitude } = params || {}

    const hasValidLocation =
      latitude && longitude && (latitude !== 0 || longitude !== 0)

    const [events] = await this.prisma.$transaction([
      this.prisma.event.findMany({
        where: {
          endDate: {
            gt: now,
          },
          advertisements: {
            some: {
              status: AdvertisementStatus.ACTIVE,
              expirationDate: {
                gt: now,
              },
              advertisementAuthorizations: {
                some: {
                  status: AdvertisementAuthorizationStatus.AUTHORIZED,
                },
              },
            },
          },
        },
        include: {
          company: {
            include: {
              address: true,
              companyDocuments: {
                include: {
                  document: true,
                },
              },
              companyImages: {
                include: {
                  image: true,
                },
              },
              informations: {
                where: {
                  eventId: null,
                },
              },
            },
          },
          address: true,
          category: true,
          informations: true,
          eventImages: {
            include: {
              image: true,
            },
          },
        },
      }),
    ])

    const userLocation: Coordinate = {
      latitude: Number(latitude) || 0,
      longitude: Number(longitude) || 0,
    }

    const eventsWithDistance = events
      .map((event) => {
        if (!hasValidLocation || !event.address) {
          return {
            ...event,
            distanceInKm: null,
          }
        }

        const eventLocation: Coordinate = {
          latitude: Number(event.address.latitude),
          longitude: Number(event.address.longitude),
        }

        const distance = getDistanceBetweenCoordinates(
          userLocation,
          eventLocation,
        )

        console.log('distance', Number(distance.toFixed(2)))

        return {
          ...event,
          distanceInKm: Number(distance.toFixed(2)),
        }
      })
      .sort((a, b) => Number(a.distanceInKm) - Number(b.distanceInKm))

    return eventsWithDistance.map(PrismaEventDetailsMapper.toDomain)
  }

  async findManyForUser(
    userId: string,
    params?: FindManyEventsParams,
  ): Promise<EventDetails[]> {
    const now = new Date()
    const { latitude, longitude } = params || {}

    const hasValidLocation =
      latitude && longitude && (latitude !== 0 || longitude !== 0)

    const [events] = await this.prisma.$transaction([
      this.prisma.event.findMany({
        where: {
          endDate: {
            gt: now,
          },
          advertisements: {
            some: {
              status: AdvertisementStatus.ACTIVE,
              expirationDate: {
                gt: now,
              },
              advertisementAuthorizations: {
                some: {
                  status: AdvertisementAuthorizationStatus.AUTHORIZED,
                },
              },
            },
          },
        },
        include: {
          company: {
            include: {
              address: true,
              companyDocuments: {
                include: {
                  document: true,
                },
              },
              companyImages: {
                include: {
                  image: true,
                },
              },
              informations: {
                where: {
                  eventId: null,
                },
              },
            },
          },
          address: true,
          category: true,
          informations: true,
          eventImages: {
            include: {
              image: true,
            },
          },
          favorites: {
            where: {
              userId,
            },
            select: {
              id: true,
            },
          },
        },
      }),
    ])

    console.log({ latitude, longitude })

    const userLocation: Coordinate = {
      latitude: Number(latitude) || 0,
      longitude: Number(longitude) || 0,
    }

    const eventsWithDistance = events
      .map((event) => {
        if (!hasValidLocation || !event.address) {
          return {
            ...event,
            distanceInKm: null,
          }
        }

        const eventLocation: Coordinate = {
          latitude: Number(event.address.latitude),
          longitude: Number(event.address.longitude),
        }

        const distance = getDistanceBetweenCoordinates(
          userLocation,
          eventLocation,
        )

        console.log('distance', Number(distance.toFixed(2)))

        return {
          ...event,
          isFavorited: event.favorites.length > 0,
          distanceInKm: Number(distance.toFixed(2)),
        }
      })
      .sort((a, b) => Number(a.distanceInKm) - Number(b.distanceInKm))

    return eventsWithDistance.map(PrismaEventDetailsMapper.toDomain)
  }

  async create(event: Event): Promise<void> {
    const data = PrismaEventMapper.toPersistency(event)

    await this.prisma.$transaction([
      this.prisma.event.create({
        data,
      }),
    ])

    await this.eventImagesRepository.createMany(event.images.getItems())
  }

  async save(event: Event): Promise<void> {
    const data = PrismaEventMapper.toPersistency(event)

    await Promise.all([
      this.prisma.event.update({
        where: {
          id: event.id.toString(),
        },
        data,
      }),
      this.eventImagesRepository.createMany(event.images.getNewItems()),
      this.eventImagesRepository.deleteMany(event.images.getRemovedItems()),
    ])
  }
}
