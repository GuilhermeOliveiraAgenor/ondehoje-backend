import { PaymentDetails } from '@/domain/payment/enterprise/entities/value-objects/payment-details'

import { AdvertisementDetailsPresenter } from '../../advertisement/presenters/advertisement-details-presenter'
import { SubscriptionPresenter } from '../../subscription/presenters/subscription-presenter'
import { getPaymentStatusDescription } from '../utils/get-payment-status-description'

export class PaymentDetailsPresenter {
  static toHTTP(raw: PaymentDetails) {
    return {
      subscription: raw.subscription
        ? SubscriptionPresenter.toHTTP(raw.subscription)
        : null,
      advertisement: raw.advertisement
        ? AdvertisementDetailsPresenter.toHTTP(raw.advertisement)
        : null,
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
