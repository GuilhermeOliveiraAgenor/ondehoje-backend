import { CouponDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/coupon-details'

import { EventDetailsPresenter } from '../../event/presenters/event-details-presenter'

export class CouponDetailsPresenter {
  static toHTTP(raw: CouponDetails) {
    return {
      id: raw.id.toString(),
      event: EventDetailsPresenter.toHTTP(raw.event),
      name: raw.name,
      description: raw.description,
      expiresAt: raw.expiresAt,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      isRedeemed: raw.isRedeemed,
    }
  }
}
