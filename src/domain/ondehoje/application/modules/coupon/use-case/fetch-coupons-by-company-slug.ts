import { Injectable } from '@nestjs/common'

import { Either, success } from '@/core/either'
import { CouponDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/coupon-details'

import { CompaniesRepository } from '../../company/repositories/companies-repository'
import { CouponsRepository } from '../repositories/coupons-repository'

interface FetchCouponsByCompanySlugRequest {
  companySlug: string
}

type FetchCouponsByCompanySlugResponse = Either<
  null,
  {
    coupons: CouponDetails[]
  }
>

@Injectable()
export class FetchCouponsByCompanySlugUseCase {
  constructor(
    private companiesRepository: CompaniesRepository,
    private couponsRepository: CouponsRepository,
  ) {}

  async execute({
    companySlug,
  }: FetchCouponsByCompanySlugRequest): Promise<FetchCouponsByCompanySlugResponse> {
    const company = await this.companiesRepository.findBySlug(companySlug)

    if (!company) {
      return success({
        coupons: [],
      })
    }

    const coupons = await this.couponsRepository.findManyByCompanyId(
      company.id.toString(),
    )

    return success({
      coupons,
    })
  }
}
