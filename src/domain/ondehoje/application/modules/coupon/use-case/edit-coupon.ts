import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Coupon } from '@/domain/ondehoje/enterprise/entities/coupon'

import { CouponsRepository } from '../repositories/coupons-repository'

interface EditCouponRequest {
  id: string
  name?: Coupon['name']
  description?: Coupon['description']
  expiresAt?: Coupon['expiresAt']
}

type EditCouponResponse = Either<
  ResourceNotFoundError,
  {
    coupon: Coupon
  }
>

@Injectable()
export class EditCouponUseCase {
  constructor(private couponsRepository: CouponsRepository) {}

  async execute({
    id,
    name,
    description,
    expiresAt,
  }: EditCouponRequest): Promise<EditCouponResponse> {
    const coupon = await this.couponsRepository.findById(id)

    if (!coupon) {
      return failure(new ResourceNotFoundError('Coupon'))
    }

    coupon.name = name ?? coupon.name
    coupon.description = description ?? coupon.description
    coupon.expiresAt = expiresAt ?? coupon.expiresAt

    await this.couponsRepository.save(coupon)

    return success({
      coupon,
    })
  }
}
