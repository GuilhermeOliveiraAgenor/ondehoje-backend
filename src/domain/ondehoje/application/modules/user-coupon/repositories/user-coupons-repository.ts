import { UserCoupon } from '@/domain/ondehoje/enterprise/entities/user-coupon'
import { UserCouponDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/user-coupon-details'

export abstract class UserCouponsRepository {
  abstract findById(id: string): Promise<UserCoupon | null>
  abstract findManyByUserId(userId: string): Promise<UserCouponDetails[]>
  abstract create(userCoupon: UserCoupon): Promise<void>
  abstract save(userCoupon: UserCoupon): Promise<void>
  abstract delete(userCoupon: UserCoupon): Promise<void>
}
