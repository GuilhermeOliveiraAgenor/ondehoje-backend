import { Coupon } from '@/domain/ondehoje/enterprise/entities/coupon'
import { CouponDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/coupon-details'

export abstract class CouponsRepository {
  abstract findById(id: string): Promise<Coupon | null>
  abstract findByNameAndEventId(
    name: string,
    eventId: string,
  ): Promise<Coupon | null>

  abstract findManyByCompanyId(companyId: string): Promise<CouponDetails[]>

  abstract findManyByEventId(
    eventId: string,
    userId: string,
  ): Promise<CouponDetails[]>

  abstract create(coupon: Coupon): Promise<void>
  abstract save(coupon: Coupon): Promise<void>
  abstract delete(coupon: Coupon): Promise<void>
}
