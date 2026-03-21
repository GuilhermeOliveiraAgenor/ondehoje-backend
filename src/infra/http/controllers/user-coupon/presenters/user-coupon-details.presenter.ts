import { UserCouponDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/user-coupon-details'

import { CouponDetailsPresenter } from '../../coupon/presenters/coupon-details-presenter'

export class UserCouponDetailsPresenter {
  static toHTTP(raw: UserCouponDetails) {
    return {
      coupon: CouponDetailsPresenter.toHTTP(raw.coupon),
      hash: raw.hash,
      usedAt: raw.usedAt,
      createdAt: raw.createdAt,
    }
  }
}
