import {
  AdvertisementAuthorization as PrismaAdvertisementAuthorization,
  Prisma,
} from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AdvertisementAuthorization } from '@/domain/ondehoje/enterprise/entities/advertisement-authorization'

export class PrismaAdvertisementAuthorizationMapper {
  static toDomain(
    raw: PrismaAdvertisementAuthorization,
  ): AdvertisementAuthorization {
    return AdvertisementAuthorization.create(
      {
        advertisementId: new UniqueEntityID(raw.advertisementId),
        status: raw.status,
        decidedAt: raw.decidedAt,
        decidedBy: new UniqueEntityID(raw.decidedBy),
        rejectedReason: raw.rejectedReason,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistency(
    raw: AdvertisementAuthorization,
  ): Prisma.AdvertisementAuthorizationUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      advertisementId: raw.advertisementId.toString(),
      status: raw.status,
      decidedAt: raw.decidedAt,
      decidedBy: raw.decidedBy.toString(),
      rejectedReason: raw.rejectedReason,
    }
  }
}
