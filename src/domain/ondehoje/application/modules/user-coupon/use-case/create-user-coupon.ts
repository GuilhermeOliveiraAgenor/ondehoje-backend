import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UserCoupon } from '@/domain/ondehoje/enterprise/entities/user-coupon'

import { ExpiredCouponError } from '../../coupon/errors/expired-coupon-error'
import { CouponsRepository } from '../../coupon/repositories/coupons-repository'
import { UserCouponsRepository } from '../repositories/user-coupons-repository'

interface CreateUserCouponUseCaseRequest {
  couponId: string
  userId: string
}

type CreateUserCouponUseCaseResponse = Either<
  ResourceNotFoundError | ExpiredCouponError,
  {
    userCoupon: UserCoupon
  }
>

@Injectable()
export class CreateUserCouponUseCase {
  constructor(
    private couponsRepository: CouponsRepository,
    private userCouponsRepostory: UserCouponsRepository,
  ) {}

  async execute({
    couponId,
    userId,
  }: CreateUserCouponUseCaseRequest): Promise<CreateUserCouponUseCaseResponse> {
    const coupon = await this.couponsRepository.findById(couponId)

    if (!coupon) {
      return failure(new ResourceNotFoundError(couponId))
    }

    const now = new Date()

    if (coupon.expiresAt < now) {
      return failure(new ExpiredCouponError())
    }

    const userCoupon = UserCoupon.create({
      couponId: new UniqueEntityID(couponId),
      userId: new UniqueEntityID(userId),
    })

    await this.userCouponsRepostory.create(userCoupon)

    return success({
      userCoupon,
    })
  }
}
