import { BadRequestException, Controller, Get, Param } from '@nestjs/common'

import { GetPaymentByCheckoutIdUseCase } from '@/domain/payment/application/use-cases/get-payment-by-checkout-id'

import { PaymentDetailsPresenter } from '../presenters/payment-details.presenter'

@Controller('/by-checkout/:checkoutId')
export class GetPaymentByCheckoutIdController {
  constructor(private getPaymentByCheckoutId: GetPaymentByCheckoutIdUseCase) {}

  @Get()
  async handle(@Param('checkoutId') checkoutId: string) {
    const result = await this.getPaymentByCheckoutId.execute({
      checkoutId,
    })

    if (result.isError()) {
      throw new BadRequestException()
    }

    const { payment } = result.value

    return {
      payment: PaymentDetailsPresenter.toHTTP(payment),
    }
  }
}
