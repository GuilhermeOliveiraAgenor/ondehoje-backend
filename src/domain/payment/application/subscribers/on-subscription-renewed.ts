import { Injectable } from '@nestjs/common'

import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { ParametersRepository } from '@/domain/ondehoje/application/modules/parameter/repositories/parameters-repository'
import { SubscriptionRenewedEvent } from '@/domain/ondehoje/enterprise/events/subscription-renewed-event'

import { CreatePaymentUseCase } from '../use-cases/create-payment'

@Injectable()
export class OnSubscriptionRenewed implements EventHandler {
  constructor(
    private parametersRepository: ParametersRepository,
    private createPayment: CreatePaymentUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.createNewPayment.bind(this),
      SubscriptionRenewedEvent.name,
    )
  }

  private async createNewPayment({ subscription }: SubscriptionRenewedEvent) {
    const thirtyMinutes = new Date()
    thirtyMinutes.setMinutes(thirtyMinutes.getMinutes() + 30)

    const subscriptionPrice =
      await this.parametersRepository.findByKey('subscription.price')

    if (!subscriptionPrice) {
      throw new Error('Parameter subscription.price not found')
    }

    const amount = Number(subscriptionPrice.value)

    await this.createPayment.execute({
      subscription,
      amount: amount * 100, // Convert to cents
      expiresAt: thirtyMinutes,
    })
  }
}
