import { Module } from '@nestjs/common'

import { CreateCouponUseCase } from '@/domain/ondehoje/application/modules/coupon/use-case/create-coupon'
import { EditCouponUseCase } from '@/domain/ondehoje/application/modules/coupon/use-case/edit-coupon'
import { FetchCouponsByCompanySlugUseCase } from '@/domain/ondehoje/application/modules/coupon/use-case/fetch-coupons-by-company-slug'
import { FetchCouponsByEventIdUseCase } from '@/domain/ondehoje/application/modules/coupon/use-case/fetch-coupons-by-event-id'
import { DatabaseModule } from '@/infra/database/database.module'

import { CreateCouponController } from './routes/create-coupon.controller'
import { EditCouponController } from './routes/edit-coupon.controller'
import { FetchCouponsByCompanySlugController } from './routes/fetch-coupons-by-company-slug.controller'
import { FetchCouponsByEventIdController } from './routes/fetch-coupons-by-event-id.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateCouponController,
    EditCouponController,
    FetchCouponsByCompanySlugController,
    FetchCouponsByEventIdController,
  ],
  providers: [
    CreateCouponUseCase,
    EditCouponUseCase,
    FetchCouponsByCompanySlugUseCase,
    FetchCouponsByEventIdUseCase,
  ],
})
export class HttpCouponModule {}
