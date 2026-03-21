import { BadRequestException, Controller, Get, Param } from '@nestjs/common'

import { FetchPaymentsByAdvertisementIdUseCase } from '@/domain/payment/application/use-cases/fetch-payments-by-advertisement-id'

import { PaymentPresenter } from '../presenters/payment.presenter'

@Controller('/advertisements/:advertisementId')
export class FetchPaymentsByAdvertisementIdController {
  constructor(
    private fetchPaymentsByAdvertisementId: FetchPaymentsByAdvertisementIdUseCase,
  ) {}

  @Get()
  async handle(@Param('advertisementId') advertisementId: string) {
    const result = await this.fetchPaymentsByAdvertisementId.execute({
      advertisementId,
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
