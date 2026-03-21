import { Injectable } from '@nestjs/common'

import { Either, success } from '@/core/either'
import { CouponDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/coupon-details'

import { CouponsRepository } from '../repositories/coupons-repository'

interface FetchCouponsByEventIdRequest {
  eventId: string
  userId: string
}

type FetchCouponsByEventIdResponse = Either<
  null,
  {
    coupons: CouponDetails[]
  }
>

@Injectable()
export class FetchCouponsByEventIdUseCase {
  constructor(private couponsRepository: CouponsRepository) {}

  async execute({
    eventId,
    userId,
  }: FetchCouponsByEventIdRequest): Promise<FetchCouponsByEventIdResponse> {
    const coupons = await this.couponsRepository.findManyByEventId(
      eventId,
      userId,
    )

    return success({
      coupons,
    })
  }
}
