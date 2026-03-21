import { PaymentProvider } from '@/domain/payment/application/enums/payment-provider'
import { PaymentStatus } from '@/domain/payment/application/enums/payment-status'

export const paymentStatusByProvider: Record<
  PaymentProvider,
  Record<string, string>
> = {
  [PaymentProvider.STRIPE]: {
    processing: PaymentStatus.PENDING,
    amount_capturable_updated: PaymentStatus.PENDING,
    succeeded: PaymentStatus.PAID,
    payment_failed: PaymentStatus.FAILED,
  },
  [PaymentProvider.PAGAR_ME]: {},
}
