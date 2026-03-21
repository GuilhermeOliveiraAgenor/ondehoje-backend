import { Injectable } from '@nestjs/common'

import { Either, success } from '@/core/either'
import { UserCouponDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/user-coupon-details'

import { UserCouponsRepository } from '../repositories/user-coupons-repository'

interface FetchUserCouponsByUserIdRequest {
  userId: string
}

type FetchUserCouponsByUserIdResponse = Either<
  null,
  {
    userCoupons: UserCouponDetails[]
  }
>

@Injectable()
export class FetchUserCouponsByUserIdUseCase {
  constructor(private userCouponsRepository: UserCouponsRepository) {}

  async execute({
    userId,
  }: FetchUserCouponsByUserIdRequest): Promise<FetchUserCouponsByUserIdResponse> {
    const userCoupons =
      await this.userCouponsRepository.findManyByUserId(userId)

    return success({
      userCoupons,
    })
  }
}
