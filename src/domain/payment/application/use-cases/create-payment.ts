import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { MissingRequiredParametersError } from '@/core/errors/missing-required-parameters-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Advertisement } from '@/domain/ondehoje/enterprise/entities/advertisement'
import { Subscription } from '@/domain/ondehoje/enterprise/entities/subscription'
import { Payment } from '@/domain/payment/enterprise/entities/payment'

import { PaymentStatus } from '../enums/payment-status'
import { PaymentGateway } from '../gateways/payment-gateway'
import { PaymentsRepository } from '../repositories/payments-repository'

export interface CreatePaymentUseCaseRequest {
  advertisement?: Advertisement | null
  subscription?: Subscription | null
  amount: Payment['amount']
  expiresAt: Payment['expiresAt']
}

export type CreatePaymentUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    payment: Payment
  }
>

@Injectable()
export class CreatePaymentUseCase {
  constructor(
    private paymentsRepository: PaymentsRepository,
    private paymentGateway: PaymentGateway,
  ) {}

  async execute({
    advertisement,
    subscription,
    amount,
    expiresAt,
  }: CreatePaymentUseCaseRequest): Promise<CreatePaymentUseCaseResponse> {
    if (!advertisement && !subscription) {
      return failure(
        new MissingRequiredParametersError(['Advertisement', 'Subscription']),
      )
    }

    const payment = Payment.create({
      advertisementId: advertisement ? advertisement.id : null,
      subscriptionId: subscription ? subscription.id : null,
      status: PaymentStatus.PENDING,
      amount,
      expiresAt,
    })

    const checkout = await this.paymentGateway.checkout(payment)

    payment.gateway = checkout.gateway
    payment.checkoutId = checkout.checkoutId
    payment.tax = checkout.tax
    payment.link = checkout.link

    await this.paymentsRepository.create(payment)

    return success({
      payment,
    })
  }
}
