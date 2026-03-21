import { Injectable } from '@nestjs/common'

import { type Either, failure, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { PaymentDetails } from '../../enterprise/entities/value-objects/payment-details'
import { PaymentsRepository } from '../repositories/payments-repository'

interface GetPaymentByCheckoutIdUseCaseRequest {
  checkoutId: PaymentDetails['checkoutId']
}

type GetPaymentByCheckoutIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    payment: PaymentDetails
  }
>

@Injectable()
export class GetPaymentByCheckoutIdUseCase {
  constructor(private paymentsRepository: PaymentsRepository) {}

  async execute({
    checkoutId,
  }: GetPaymentByCheckoutIdUseCaseRequest): Promise<GetPaymentByCheckoutIdUseCaseResponse> {
    const payment =
      await this.paymentsRepository.findFirstByCheckoutId(checkoutId)

    if (!payment) {
      return failure(new ResourceNotFoundError('Payment'))
    }

    return success({
      payment,
    })
  }
}
