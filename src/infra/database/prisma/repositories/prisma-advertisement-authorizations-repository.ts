import { Injectable } from '@nestjs/common'

import { DomainEvents } from '@/core/events/domain-events'
import { AdvertisementAuthorizationsRepository } from '@/domain/ondehoje/application/modules/advertisement-authorization/repositories/advertisement-authorizations-repository'
import { AdvertisementAuthorization } from '@/domain/ondehoje/enterprise/entities/advertisement-authorization'

import { PrismaAdvertisementAuthorizationMapper } from '../mappers/prisma-advertisement-authorization-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAdvertisementAuthorizationsRepository
  implements AdvertisementAuthorizationsRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<AdvertisementAuthorization | null> {
    const [advertisementAuthorization] = await this.prisma.$transaction([
      this.prisma.advertisementAuthorization.findUnique({
        where: {
          id,
        },
      }),
    ])

    if (!advertisementAuthorization) {
      return null
    }

    return PrismaAdvertisementAuthorizationMapper.toDomain(
      advertisementAuthorization,
    )
  }

  async findManyByAdvertisementId(
    advertisementId: string,
  ): Promise<AdvertisementAuthorization[]> {
    const [advertisementAuthorizations] = await this.prisma.$transaction([
      this.prisma.advertisementAuthorization.findMany({
        where: {
          advertisementId,
        },
        orderBy: {
          decidedAt: 'desc',
        },
      }),
    ])

    return advertisementAuthorizations.map(
      PrismaAdvertisementAuthorizationMapper.toDomain,
    )
  }

  async create(
    advertisementAuthorization: AdvertisementAuthorization,
  ): Promise<void> {
    const data = PrismaAdvertisementAuthorizationMapper.toPersistency(
      advertisementAuthorization,
    )

    await this.prisma.$transaction([
      this.prisma.advertisementAuthorization.create({
        data,
      }),
    ])

    DomainEvents.dispatchEventsForAggregate(advertisementAuthorization.id)
  }
}
