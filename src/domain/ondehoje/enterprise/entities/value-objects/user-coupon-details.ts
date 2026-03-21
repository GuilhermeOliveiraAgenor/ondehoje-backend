import { ValueObject } from '@/core/entities/value-object'

import { CouponDetails } from './coupon-details'

interface UserCouponDetailsProps {
  coupon: CouponDetails
  hash: string
  usedAt: Date | null
  createdAt: Date
}

export class UserCouponDetails extends ValueObject<UserCouponDetailsProps> {
  get coupon() {
    return this.props.coupon
  }

  get hash() {
    return this.props.hash
  }

  get usedAt() {
    return this.props.usedAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(props: UserCouponDetailsProps) {
    const userCouponDetails = new UserCouponDetails(props)

    return userCouponDetails
  }
}
