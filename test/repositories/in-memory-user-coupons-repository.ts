import { UserCouponsRepository } from '@/domain/ondehoje/application/modules/user-coupon/repositories/user-coupons-repository'
import { UserCoupon } from '@/domain/ondehoje/enterprise/entities/user-coupon'
import { CouponDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/coupon-details'
import { UserCouponDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/user-coupon-details'

import { InMemoryCouponsRepository } from './in-memory-coupons-repository'
import { InMemoryEventsRepository } from './in-memory-events-repository'

export class InMemoryUserCouponsRepository implements UserCouponsRepository {
  public items: UserCoupon[] = []

  constructor(
    private couponsRepository: InMemoryCouponsRepository,
    private eventsRepository: InMemoryEventsRepository,
  ) {}

  async findById(id: string): Promise<UserCoupon | null> {
    const userCoupon = this.items.find(
      (item) => item.couponId.toString() === id,
    )

    if (!userCoupon) {
      return null
    }

    return userCoupon
  }

  async findManyByUserId(userId: string): Promise<UserCouponDetails[]> {
    const cupons = this.items
      .filter((item) => item.userId.toString() === userId)
      .map((userCoupon) => {
        const coupon = this.couponsRepository.items.find(
          (coupon) => coupon.id === userCoupon.couponId,
        )

        if (!coupon) {
          throw new Error('Coupon not found')
        }

        const event = this.eventsRepository.items.find(
          (event) => event.id === coupon.eventId,
        )

        if (!event) {
          throw new Error('Event not found')
        }

        const couponDetails = CouponDetails.create({
          id: coupon.id,
          event,
          name: coupon.name,
          description: coupon.description,
          expiresAt: coupon.expiresAt,
          createdAt: coupon.createdAt,
          createdBy: coupon.createdBy,
          updatedAt: coupon.updatedAt,
          updatedBy: coupon.updatedBy,
          deletedAt: coupon.deletedAt,
          deletedBy: coupon.deletedBy,
        })

        return UserCouponDetails.create({
          coupon: couponDetails,
          hash: userCoupon.hash,
          usedAt: userCoupon.usedAt,
          createdAt: userCoupon.createdAt,
        })
      })

    return cupons
  }

  async create(userCoupon: UserCoupon): Promise<void> {
    this.items.push(userCoupon)
  }

  async save(userCoupon: UserCoupon): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === userCoupon.id)

    this.items[itemIndex] = userCoupon
  }

  async delete(userCoupon: UserCoupon): Promise<void> {
    const id = this.items.filter((item) => item.id === userCoupon.id)

    this.items = id
  }
}
