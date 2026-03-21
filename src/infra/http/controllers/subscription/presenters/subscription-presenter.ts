import { Subscription } from '@/domain/ondehoje/enterprise/entities/subscription'

import { getSubscriptionStatusDescription } from '../utils/get-subscription-status-description'

export class SubscriptionPresenter {
  static toHTTP(raw: Subscription) {
    return {
      id: raw.id.toString(),
      startDate: raw.startDate,
      endDate: raw.endDate,
      status: getSubscriptionStatusDescription(raw.status),
      amount: raw.amount / 100,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }
  }
}
