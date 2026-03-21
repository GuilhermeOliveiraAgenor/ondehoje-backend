import { Coupon as PrismaCoupon, Prisma } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Coupon } from '@/domain/ondehoje/enterprise/entities/coupon'

export class PrismaCouponMapper {
  static toDomain(raw: PrismaCoupon): Coupon {
    return Coupon.create(
      {
        eventId: new UniqueEntityID(raw.eventId),
        name: raw.name,
        description: raw.description,
        expiresAt: raw.expiresAt,
        createdAt: raw.createdAt,
        createdBy: new UniqueEntityID(raw.createdBy),
        updatedAt: raw.updatedAt,
        updatedBy: raw.updatedBy ? new UniqueEntityID(raw.updatedBy) : null,
        deletedAt: raw.deletedAt,
        deletedBy: raw.deletedBy ? new UniqueEntityID(raw.deletedBy) : null,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistency(raw: Coupon): Prisma.CouponUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      eventId: raw.eventId.toString(),
      name: raw.name,
      description: raw.description,
      expiresAt: raw.expiresAt,
      createdAt: raw.createdAt,
      createdBy: raw.createdBy.toString(),
      updatedAt: raw.updatedAt,
      updatedBy: raw.updatedBy ? raw.updatedBy.toString() : null,
      deletedAt: raw.deletedAt,
      deletedBy: raw.deletedBy ? raw.deletedBy.toString() : null,
    }
  }
}
