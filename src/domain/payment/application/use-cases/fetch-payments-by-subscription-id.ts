import { Injectable } from '@nestjs/common'

import { Either, success } from '@/core/either'
import { Payment } from '@/domain/payment/enterprise/entities/payment'

import { PaymentsRepository } from '../repositories/payments-repository'

interface FetchPaymentsBySubscriptionIdUseCaseRequest {
  subscriptionId: string
}

type FetchPaymentsBySubscriptionIdUseCaseResponse = Either<
  null,
  {
    payments: Payment[]
  }
>

@Injectable()
export class FetchPaymentsBySubscriptionIdUseCase {
  constructor(private paymentRepository: PaymentsRepository) {}

  async execute({
    subscriptionId,
  }: FetchPaymentsBySubscriptionIdUseCaseRequest): Promise<FetchPaymentsBySubscriptionIdUseCaseResponse> {
    const payments =
      await this.paymentRepository.findManyBySubscriptionId(subscriptionId)

    return success({
      payments,
    })
  }
}
