import { BadRequestException, Controller, Get, Param } from '@nestjs/common'

import { FetchPaymentsBySubscriptionIdUseCase } from '@/domain/payment/application/use-cases/fetch-payments-by-subscription-id'

import { PaymentPresenter } from '../presenters/payment.presenter'

@Controller('/subscriptions/:subscriptionId')
export class FetchPaymentsBySubscriptionIdController {
  constructor(
    private fetchPaymentsBySubscriptionId: FetchPaymentsBySubscriptionIdUseCase,
  ) {}

  @Get()
  async handle(@Param('subscriptionId') subscriptionId: string) {
    const result = await this.fetchPaymentsBySubscriptionId.execute({
      subscriptionId,
    })

    if (result.isError()) {
      throw new BadRequestException()
    }

    const { payments } = result.value

    return {
      payments: payments.map(PaymentPresenter.toHTTP),
    }
  }
}
