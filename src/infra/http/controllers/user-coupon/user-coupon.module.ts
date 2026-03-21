import { Module } from '@nestjs/common'

import { CreateUserCouponUseCase } from '@/domain/ondehoje/application/modules/user-coupon/use-case/create-user-coupon'
import { FetchUserCouponsByUserIdUseCase } from '@/domain/ondehoje/application/modules/user-coupon/use-case/fetch-user-coupons-by-user-id'
import { DatabaseModule } from '@/infra/database/database.module'

import { CreateUserCouponController } from './routes/create-user-coupon.controller'
import { FetchUserCouponsByUserIdController } from './routes/fetch-user-coupons-by-user.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [CreateUserCouponController, FetchUserCouponsByUserIdController],
  providers: [CreateUserCouponUseCase, FetchUserCouponsByUserIdUseCase],
})
export class HttpUserCouponModule {}
