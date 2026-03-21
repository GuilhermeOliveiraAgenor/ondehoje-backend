import { BadRequestException, Controller, Get, Param } from '@nestjs/common'

import type { IdentityDetails } from '@/domain/identity-access/enterprise/entities/value-object/identity-details'
import { FetchCouponsByEventIdUseCase } from '@/domain/ondehoje/application/modules/coupon/use-case/fetch-coupons-by-event-id'
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator'

import { CouponDetailsPresenter } from '../presenters/coupon-details-presenter'

@Controller('/event/:id')
export class FetchCouponsByEventIdController {
  constructor(private fetchCouponsByEventId: FetchCouponsByEventIdUseCase) {}

  @Get()
  async handle(@Param('id') id: string, @CurrentUser() user: IdentityDetails) {
    const result = await this.fetchCouponsByEventId.execute({
      eventId: id,
      userId: user.id.toString(),
    })

    if (result.isError()) {
      throw new BadRequestException()
    }

    const { coupons } = result.value

    return {
      coupons: coupons.map(CouponDetailsPresenter.toHTTP),
    }
  }
}
