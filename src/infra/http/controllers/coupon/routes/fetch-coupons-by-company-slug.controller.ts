import { BadRequestException, Controller, Get, Param } from '@nestjs/common'

import { FetchCouponsByCompanySlugUseCase } from '@/domain/ondehoje/application/modules/coupon/use-case/fetch-coupons-by-company-slug'

import { CouponDetailsPresenter } from '../presenters/coupon-details-presenter'

@Controller('/company/:slug')
export class FetchCouponsByCompanySlugController {
  constructor(
    private fetchCouponsByCompanySlug: FetchCouponsByCompanySlugUseCase,
  ) {}

  @Get()
  async handle(@Param('slug') slug: string) {
    const result = await this.fetchCouponsByCompanySlug.execute({
      companySlug: slug,
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
