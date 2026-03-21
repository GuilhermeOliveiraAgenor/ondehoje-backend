import { UseCaseError } from '@/core/errors/use-case-error'

export class CouponAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Coupon ${identifier} already exists`)
  }
}
