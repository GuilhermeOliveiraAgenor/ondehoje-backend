import type { Payment } from '@/domain/payment/enterprise/entities/payment'

export type CheckoutResponse = {
  gateway: Payment['gateway']
  checkoutId: Payment['checkoutId']
  tax: Payment['tax']
  link: Payment['link']
}

export abstract class PaymentGateway {
  abstract checkout(payment: Payment): Promise<CheckoutResponse>
}
