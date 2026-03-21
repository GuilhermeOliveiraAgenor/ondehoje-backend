import {
  BadRequestException,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  PreconditionFailedException,
} from '@nestjs/common'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import type { IdentityDetails } from '@/domain/identity-access/enterprise/entities/value-object/identity-details'
import { ExpiredCouponError } from '@/domain/ondehoje/application/modules/coupon/errors/expired-coupon-error'
import { CreateUserCouponUseCase } from '@/domain/ondehoje/application/modules/user-coupon/use-case/create-user-coupon'
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator'

@Controller('/coupon/:couponId')
export class CreateUserCouponController {
  constructor(private createUserCoupon: CreateUserCouponUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async handle(
    @Param('couponId') couponId: string,
    @CurrentUser() user: IdentityDetails,
  ) {
    const result = await this.createUserCoupon.execute({
      couponId,
      userId: user.id.toString(),
    })

    if (result.isError()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new PreconditionFailedException(error.message)
        case ExpiredCouponError:
          throw new PreconditionFailedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
