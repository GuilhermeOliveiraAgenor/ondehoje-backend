import { PaymentsRepository } from '@/domain/payment/application/repositories/payments-repository'
import { Payment } from '@/domain/payment/enterprise/entities/payment'
import { PaymentDetails } from '@/domain/payment/enterprise/entities/value-objects/payment-details'

import { InMemoryAdvertisementsRepository } from './in-memory-advertisements-repository'
import { InMemorySubscriptionsRepository } from './in-memory-subscriptions-repository'

export class InMemoryPaymentsRepository implements PaymentsRepository {
  public items: Payment[] = []

  constructor(
    private subscriptionsRepository: InMemorySubscriptionsRepository,
    private advertisementsRepository: InMemoryAdvertisementsRepository,
  ) {}

  async findById(id: string): Promise<Payment | null> {
    const payment = this.items.find((payment) => payment.id.toString() === id)

    if (!payment) {
      return null
    }

    return payment
  }

  async findFirstByCheckoutId(
    checkoutId: Payment['checkoutId'],
  ): Promise<PaymentDetails | null> {
    const payment = this.items.find(
      (payment) => payment.checkoutId === checkoutId,
    )

    if (!payment) {
      return null
    }

    const subscription =
      this.subscriptionsRepository.items.find(
        (sub) => sub.id.toString() === payment.subscriptionId?.toString(),
      ) || null

    const paymentDetails = PaymentDetails.create({
      id: payment.id,
      gateway: payment.gateway,
      checkoutId: payment.checkoutId,
      amount: payment.amount,
      tax: payment.tax,
      status: payment.status,
      link: payment.link,
      method: payment.method,
      pixData: payment.pixData,
      finalCard: payment.finalCard,
      confirmationDate: payment.confirmationDate,
      expiresAt: payment.expiresAt,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      subscription,
      advertisement: null,
    })

    return paymentDetails
  }

  async findByGatewayAndCheckoutId(
    gateway: Payment['gateway'],
    checkoutId: Payment['checkoutId'],
  ): Promise<Payment | null> {
    const payment = this.items.find(
      (payment) =>
        payment.gateway === gateway && payment.checkoutId === checkoutId,
    )

    if (!payment) {
      return null
    }

    return payment
  }

  async findManyBySubscriptionId(subscriptionId: string): Promise<Payment[]> {
    const payments = this.items.filter(
      (payment) => payment.subscriptionId?.toString() === subscriptionId,
    )

    return payments
  }

  async findManyByAdvertisementId(advertisementId: string): Promise<Payment[]> {
    const payments = this.items.filter(
      (payment) => payment.advertisementId?.toString() === advertisementId,
    )

    return payments
  }

  async create(payment: Payment): Promise<void> {
    this.items.push(payment)
  }

  async save(payment: Payment): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === payment.id)

    this.items[itemIndex] = payment
  }
}
