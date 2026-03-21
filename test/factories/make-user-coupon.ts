import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UserCoupon } from '@/domain/ondehoje/enterprise/entities/user-coupon'

export function makeUserCoupon(
  override: Partial<UserCoupon> = {},
  id?: UniqueEntityID,
) {
  const coupon = UserCoupon.create(
    {
      couponId: new UniqueEntityID(),
      userId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return coupon
}
