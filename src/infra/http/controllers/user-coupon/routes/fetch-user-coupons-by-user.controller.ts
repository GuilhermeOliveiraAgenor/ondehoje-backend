import { BadRequestException, Controller, Get } from '@nestjs/common'

import type { IdentityDetails } from '@/domain/identity-access/enterprise/entities/value-object/identity-details'
import { FetchUserCouponsByUserIdUseCase } from '@/domain/ondehoje/application/modules/user-coupon/use-case/fetch-user-coupons-by-user-id'
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator'

import { UserCouponDetailsPresenter } from '../presenters/user-coupon-details.presenter'

@Controller('/')
export class FetchUserCouponsByUserIdController {
  constructor(
    private fetchUserCouponsByUserId: FetchUserCouponsByUserIdUseCase,
  ) {}

  @Get()
  async handle(@CurrentUser() user: IdentityDetails) {
    const result = await this.fetchUserCouponsByUserId.execute({
      userId: user.id.toString(),
    })

    if (result.isError()) {
      throw new BadRequestException()
    }

    const { userCoupons } = result.value

    return {
      userCoupons: userCoupons.map(UserCouponDetailsPresenter.toHTTP),
    }
  }
}
