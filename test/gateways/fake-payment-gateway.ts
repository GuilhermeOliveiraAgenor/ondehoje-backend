import { randomUUID } from 'node:crypto'

import {
  CheckoutResponse,
  PaymentGateway,
} from '@/domain/payment/application/gateways/payment-gateway'
import { Payment } from '@/domain/payment/enterprise/entities/payment'

export class FakePaymentGateway implements PaymentGateway {
  public checkouts: Payment[] = []

  async checkout(payment: Payment): Promise<CheckoutResponse> {
    this.checkouts.push(payment)

    const checkoutId = randomUUID()
    const paymentUrl = `https://fake-gateway.com/checkout/${checkoutId}`

    return {
      checkoutId,
      gateway: 'FakeGateway',
      tax: 0,
      link: paymentUrl,
    }
  }
}
