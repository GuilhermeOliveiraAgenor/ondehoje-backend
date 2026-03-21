import { Payment } from '@/domain/payment/enterprise/entities/payment'

import { PaymentDetails } from '../../enterprise/entities/value-objects/payment-details'

export abstract class PaymentsRepository {
  abstract findById(id: string): Promise<Payment | null>
  abstract findByGatewayAndCheckoutId(
    gateway: Payment['gateway'],
    checkoutId: Payment['checkoutId'],
  ): Promise<Payment | null>

  abstract findFirstByCheckoutId(
    checkoutId: Payment['checkoutId'],
  ): Promise<PaymentDetails | null>

  abstract findManyBySubscriptionId(subscriptionId: string): Promise<Payment[]>
  abstract findManyByAdvertisementId(
    advertisementId: string,
  ): Promise<Payment[]>

  abstract create(payment: Payment): Promise<void>
  abstract save(payment: Payment): Promise<void>
}
