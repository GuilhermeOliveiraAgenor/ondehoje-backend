import { Injectable } from '@nestjs/common'

import { DomainEvents } from '@/core/events/domain-events'
import { AdvertisementsRepository } from '@/domain/ondehoje/application/modules/advertisement/repositories/advertisements-repository'
import { Advertisement } from '@/domain/ondehoje/enterprise/entities/advertisement'
import { AdvertisementDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/advertisement-details'

import { PrismaAdvertisementDetailsMapper } from '../mappers/prisma-advertisement-details-mapper'
import { PrismaAdvertisementMapper } from '../mappers/prisma-advertisement-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAdvertisementsRepository
  implements AdvertisementsRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Advertisement | null> {
    const [advertisement] = await this.prisma.$transaction([
      this.prisma.advertisement.findUnique({
        where: {
          id,
        },
      }),
    ])

    if (!advertisement) {
      return null
    }

    return PrismaAdvertisementMapper.toDomain(advertisement)
  }

  async findFirstByCompanyId(companyId: string): Promise<Advertisement | null> {
    const advertisement = await this.prisma.advertisement.findFirst({
      where: {
        companyId,
        eventId: null,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    if (!advertisement) {
      return null
    }

    return PrismaAdvertisementMapper.toDomain(advertisement)
  }

  async findFirstByEventId(eventId: string): Promise<Advertisement | null> {
    const advertisement = await this.prisma.advertisement.findFirst({
      where: {
        eventId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    if (!advertisement) {
      return null
    }

    return PrismaAdvertisementMapper.toDomain(advertisement)
  }

  async findManyByCompanyId(
    companyId: string,
  ): Promise<AdvertisementDetails[]> {
    const [advertisements] = await this.prisma.$transaction([
      this.prisma.advertisement.findMany({
        where: {
          companyId,
          eventId: null,
        },
        include: {
          company: true,
          event: true,
          advertisementAuthorizations: true,
        },
      }),
    ])

    return advertisements.map(PrismaAdvertisementDetailsMapper.toDomain)
  }

  async findManyByEventId(eventId: string): Promise<AdvertisementDetails[]> {
    const [advertisements] = await this.prisma.$transaction([
      this.prisma.advertisement.findMany({
        where: {
          eventId,
        },
        include: {
          company: true,
          event: true,
          advertisementAuthorizations: true,
        },
      }),
    ])

    return advertisements.map(PrismaAdvertisementDetailsMapper.toDomain)
  }

  async findManyByOwnerId(ownerId: string): Promise<AdvertisementDetails[]> {
    const [advertisements] = await this.prisma.$transaction([
      this.prisma.advertisement.findMany({
        where: {
          company: {
            createdBy: ownerId,
          },
        },
        include: {
          company: true,
          event: true,
          advertisementAuthorizations: true,
        },
      }),
    ])

    return advertisements.map(PrismaAdvertisementDetailsMapper.toDomain)
  }

  async create(advertisement: Advertisement): Promise<void> {
    const data = PrismaAdvertisementMapper.toPersistency(advertisement)

    await this.prisma.$transaction([
      this.prisma.advertisement.create({
        data,
      }),
    ])

    DomainEvents.dispatchEventsForAggregate(advertisement.id)
  }

  async save(advertisement: Advertisement): Promise<void> {
    const data = PrismaAdvertisementMapper.toPersistency(advertisement)

    await this.prisma.$transaction([
      this.prisma.advertisement.update({
        where: {
          id: advertisement.id.toString(),
        },
        data,
      }),
    ])
    console.log(DomainEvents.dispatchEventsForAggregate(advertisement.id))

    DomainEvents.dispatchEventsForAggregate(advertisement.id)
  }
}
