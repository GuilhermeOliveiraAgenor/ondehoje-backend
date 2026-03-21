import { CouponsRepository } from '@/domain/ondehoje/application/modules/coupon/repositories/coupons-repository'
import { Coupon } from '@/domain/ondehoje/enterprise/entities/coupon'
import { CouponDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/coupon-details'

import { InMemoryCompaniesRepository } from './in-memory-companies-repository'
import { InMemoryEventsRepository } from './in-memory-events-repository'
import type { InMemoryUserCouponsRepository } from './in-memory-user-coupons-repository'

export class InMemoryCouponsRepository implements CouponsRepository {
  public items: Coupon[] = []

  constructor(
    private eventsRepository: InMemoryEventsRepository,
    private companiesRepository: InMemoryCompaniesRepository,
    private userCouponsRepository: InMemoryUserCouponsRepository,
  ) {}

  async findById(id: string): Promise<Coupon | null> {
    const coupon = this.items.find((item) => item.id.toString() === id)

    if (!coupon) {
      return null
    }

    return coupon
  }

  async findByNameAndEventId(
    name: string,
    eventId: string,
  ): Promise<Coupon | null> {
    const coupon = this.items.find(
      (item) => item.name === name && item.eventId.toString() === eventId,
    )

    if (!coupon) {
      return null
    }

    return coupon
  }

  async findManyByCompanyId(companyId: string): Promise<CouponDetails[]> {
    const company = this.companiesRepository.items.find(
      (item) => item.id.toString() === companyId,
    )

    if (!company) {
      return []
    }

    const coupons = this.eventsRepository.items
      .filter((event) => event.companyId.toString() === company.id.toString())
      .flatMap((event) => {
        const eventCoupons = this.items.filter(
          (item) => item.eventId.toString() === event.id.toString(),
        )

        return eventCoupons.map((coupon) =>
          CouponDetails.create({
            id: coupon.id,
            event,
            name: coupon.name,
            description: coupon.description,
            expiresAt: coupon.expiresAt,
            createdAt: coupon.createdAt,
            createdBy: coupon.createdBy,
            updatedAt: coupon.updatedAt,
            updatedBy: coupon.updatedBy,
            isRedeemed: false,
          }),
        )
      })

    return coupons
  }

  async findManyByEventId(eventId: string): Promise<CouponDetails[]> {
    const coupons = this.items
      .filter((item) => item.eventId?.toString() === eventId)
      .map((coupon) => {
        const event = this.eventsRepository.items.find(
          (event) => event.id.toString() === coupon.eventId?.toString(),
        )

        if (!event) {
          throw new Error('Event not found')
        }

        const userCoupon = this.userCouponsRepository.items.find(
          (item) => item.couponId.toString() === coupon.id.toString(),
        )

        return CouponDetails.create({
          id: coupon.id,
          event,
          name: coupon.name,
          description: coupon.description,
          expiresAt: coupon.expiresAt,
          createdAt: coupon.createdAt,
          createdBy: coupon.createdBy,
          updatedAt: coupon.updatedAt,
          updatedBy: coupon.updatedBy,
          isRedeemed: !!userCoupon,
        })
      })

    return coupons
  }

  async create(coupon: Coupon): Promise<void> {
    this.items.push(coupon)
  }

  async save(coupon: Coupon): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === coupon.id)

    this.items[itemIndex] = coupon
  }

  async delete(coupon: Coupon): Promise<void> {
    const id = this.items.filter((item) => item.id === coupon.id)

    this.items = id
  }
}
