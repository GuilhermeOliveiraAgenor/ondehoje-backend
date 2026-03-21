import {
  BadRequestException,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  PreconditionFailedException,
  Put,
} from '@nestjs/common'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { IdentityDetails } from '@/domain/identity-access/enterprise/entities/value-object/identity-details'
import { RenewSubscriptionUseCase } from '@/domain/ondehoje/application/modules/subscription/use-cases/renew-subscription'
import { OutstandingPaymentError } from '@/domain/payment/application/errors/outstanding-payment-error'
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator'

@Controller('/renew/:id')
export class RenewSubscriptionController {
  constructor(private renewSubscription: RenewSubscriptionUseCase) {}

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(@Param('id') id: string, @CurrentUser() user: IdentityDetails) {
    const result = await this.renewSubscription.execute({
      subscriptionId: id,
      requestedBy: user.id.toString(),
    })

    if (result.isError()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new PreconditionFailedException(error.message)
        case OutstandingPaymentError:
          throw new PreconditionFailedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
