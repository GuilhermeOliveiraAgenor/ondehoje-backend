import { type Prisma, UserCoupon as PrismaUserCoupon } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UserCoupon } from '@/domain/ondehoje/enterprise/entities/user-coupon'

export class PrismaUserCouponMapper {
  static toDomain(raw: PrismaUserCoupon): UserCoupon {
    return UserCoupon.create(
      {
        couponId: new UniqueEntityID(raw.couponId),
        userId: new UniqueEntityID(raw.userId),
        hash: raw.hash,
        usedAt: raw.usedAt,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistency(raw: UserCoupon): Prisma.UserCouponUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      couponId: raw.couponId.toString(),
      userId: raw.userId.toString(),
      hash: raw.hash,
      usedAt: raw.usedAt,
      createdAt: raw.createdAt,
    }
  }
}
