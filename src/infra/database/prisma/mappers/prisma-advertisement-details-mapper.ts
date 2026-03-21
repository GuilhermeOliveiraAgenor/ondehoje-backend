import {
  Advertisement as PrismaAdvertisement,
  AdvertisementAuthorization as PrismaAdvertisementAuthorization,
  Company as PrismaCompany,
  Event as PrismaEvent,
} from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AdvertisementDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/advertisement-details'

import { PrismaAdvertisementAuthorizationMapper } from './prisma-advertisement-authorization-mapper'
import { PrismaCompanyMapper } from './prisma-company-mapper'
import { PrismaEventMapper } from './prisma-event-mapper'

export type PrismaAdvertisementDetails = PrismaAdvertisement & {
  company: PrismaCompany
  event?: PrismaEvent | null
  advertisementAuthorizations: PrismaAdvertisementAuthorization[]
}

export class PrismaAdvertisementDetailsMapper {
  static toDomain(raw: PrismaAdvertisementDetails): AdvertisementDetails {
    return AdvertisementDetails.create({
      id: new UniqueEntityID(raw.id),
      company: PrismaCompanyMapper.toDomain(raw.company),
      event: raw.event ? PrismaEventMapper.toDomain(raw.event) : null,
      description: raw.description,
      days: raw.days,
      amount: raw.amount,
      clicks: raw.clicks,
      insights: raw.insights,
      status: raw.status,
      expirationDate: raw.expirationDate,
      advertisementAuthorizations: raw.advertisementAuthorizations.map(
        (authorization) =>
          PrismaAdvertisementAuthorizationMapper.toDomain(authorization),
      ),
      createdAt: raw.createdAt,
      createdBy: new UniqueEntityID(raw.createdBy),
      updatedAt: raw.updatedAt,
      updatedBy: raw.updatedBy ? new UniqueEntityID(raw.updatedBy) : null,
    })
  }
}
