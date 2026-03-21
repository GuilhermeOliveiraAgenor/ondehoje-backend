import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { PaymentStatus } from '@/domain/payment/application/enums/payment-status'
import { OutstandingPaymentError } from '@/domain/payment/application/errors/outstanding-payment-error'
import { PaymentsRepository } from '@/domain/payment/application/repositories/payments-repository'

import { SubscriptionStatus } from '../enum/subscription-status'
import { SubscriptionStillActiveError } from '../errors/subscription-still-active-error'
import { SubscriptionsRepository } from '../repositories/subscriptions-repository'

interface RenewSubscriptionUseCaseRequest {
  subscriptionId: string
  requestedBy: string
}

type RenewSubscriptionUseCaseResponse = Either<
  | ResourceNotFoundError
  | OutstandingPaymentError
  | SubscriptionStillActiveError,
  null
>

@Injectable()
export class RenewSubscriptionUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private paymentsRepository: PaymentsRepository,
  ) {}

  async execute({
    subscriptionId,
    requestedBy,
  }: RenewSubscriptionUseCaseRequest): Promise<RenewSubscriptionUseCaseResponse> {
    const subscription =
      await this.subscriptionsRepository.findById(subscriptionId)

    if (!subscription) {
      return failure(new ResourceNotFoundError('Subscription'))
    }

    const payments =
      await this.paymentsRepository.findManyBySubscriptionId(subscriptionId)

    const status: string[] = [
      PaymentStatus.FAILED,
      PaymentStatus.PENDING,
      PaymentStatus.UNPAID,
    ]

    const hasPendingPayment = payments.some((payment) =>
      payment.status ? status.includes(payment.status) : false,
    )

    if (hasPendingPayment) {
      return failure(new OutstandingPaymentError())
    }

    const now = new Date()

    if (now < subscription.endDate) {
      // Subscription is still active; returns error
      return failure(new SubscriptionStillActiveError())
    }

    // Waiting payment before activating the subscription
    subscription.status = SubscriptionStatus.PENDING
    subscription.updatedBy = new UniqueEntityID(requestedBy)

    await this.subscriptionsRepository.save(subscription)

    return success(null)
  }
}
