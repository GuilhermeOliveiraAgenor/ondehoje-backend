import { Payment } from '@/domain/payment/enterprise/entities/payment'

import { getPaymentStatusDescription } from '../utils/get-payment-status-description'

export class PaymentPresenter {
  static toHTTP(raw: Payment) {
    return {
      subscriptionId: raw.subscriptionId?.toString() || null,
      advertisementId: raw.advertisementId?.toString() || null,
      gateway: raw.gateway,
      checkoutId: raw.checkoutId,
      amount: raw.amount / 100,
      tax: raw.tax,
      status: getPaymentStatusDescription(raw.status),
      link: raw.link,
      method: raw.method,
      pixData: raw.pixData,
      finalCard: raw.finalCard,
      confirmationDate: raw.confirmationDate,
      expiresAt: raw.expiresAt,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }
  }
}
