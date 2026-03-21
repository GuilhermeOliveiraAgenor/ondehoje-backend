import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { AdvertisementStatus } from '@/domain/ondehoje/application/modules/advertisement/enums/advertisement-status'
import { AdvertisementsRepository } from '@/domain/ondehoje/application/modules/advertisement/repositories/advertisements-repository'
import { ParametersRepository } from '@/domain/ondehoje/application/modules/parameter/repositories/parameters-repository'
import { SubscriptionStatus } from '@/domain/ondehoje/application/modules/subscription/enum/subscription-status'
import { SubscriptionsRepository } from '@/domain/ondehoje/application/modules/subscription/repositories/subscriptions-repository'
import { Advertisement } from '@/domain/ondehoje/enterprise/entities/advertisement'
import { Subscription } from '@/domain/ondehoje/enterprise/entities/subscription'

import { PaymentStatus } from '../enums/payment-status'
import { PaymentsRepository } from '../repositories/payments-repository'

export interface ProcessPaymentWebhookUseCaseRequest {
  paymentId: string
  status: string
}

type ProcessPaymentWebhookUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class ProcessPaymentWebhookUseCase {
  constructor(
    private paymentsRepository: PaymentsRepository,
    private subscriptionsRepository: SubscriptionsRepository,
    private advertisementsRepository: AdvertisementsRepository,
    private parametersRepository: ParametersRepository,
  ) {}

  async execute({
    paymentId,
    status,
  }: ProcessPaymentWebhookUseCaseRequest): Promise<ProcessPaymentWebhookUseCaseResponse> {
    console.log(
      `Processing payment webhook for payment ID: ${paymentId} with status: ${status}`,
    )
    const payment = await this.paymentsRepository.findById(paymentId)

    if (!payment) {
      return failure(new ResourceNotFoundError('Payment'))
    }

    let subscription: Subscription | null = null
    const subscriptionId = payment.subscriptionId?.toString()
    if (subscriptionId) {
      subscription = await this.subscriptionsRepository.findById(subscriptionId)
    }

    let advertisement: Advertisement | null = null
    const advertisementId = payment.advertisementId?.toString()
    if (advertisementId) {
      advertisement =
        await this.advertisementsRepository.findById(advertisementId)
    }

    payment.status = status

    if (status === PaymentStatus.PAID) {
      payment.confirmationDate = new Date()

      if (subscription) {
        subscription.status = SubscriptionStatus.ACTIVE

        const renewalDays = await this.parametersRepository.findByKey(
          'subscription.renewal.days',
        )

        if (!renewalDays) {
          return failure(
            new ResourceNotFoundError('Parameter subscription.renewal.days'),
          )
        }

        const now = new Date()
        const newEndDate = new Date(
          now.setDate(now.getDate() + Number(renewalDays.value)),
        )

        subscription.startDate = new Date()
        subscription.endDate = newEndDate

        await this.subscriptionsRepository.save(subscription)
      }

      if (advertisement) {
        advertisement.status = AdvertisementStatus.ACTIVE

        const adDays = advertisement.days
        const now = new Date()
        const newExpirationDate = new Date(now.setDate(now.getDate() + adDays))
        advertisement.expirationDate = newExpirationDate

        await this.advertisementsRepository.save(advertisement)
      }
    }

    await this.paymentsRepository.save(payment)

    return success(null)
  }
}
