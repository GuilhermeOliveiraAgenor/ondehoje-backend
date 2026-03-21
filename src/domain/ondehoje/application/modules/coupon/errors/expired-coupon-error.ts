import { UseCaseError } from '@/core/errors/use-case-error'

export class ExpiredCouponError extends Error implements UseCaseError {
  constructor() {
    super('Coupon is expired.')
  }
}
