import {
  Payment as PrismaPayment,
  Subscription as PrismaSubscription,
} from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PaymentDetails } from '@/domain/payment/enterprise/entities/value-objects/payment-details'

import {
  type PrismaAdvertisementDetails,
  PrismaAdvertisementDetailsMapper,
} from './prisma-advertisement-details-mapper'
import { PrismaSubscriptionMapper } from './prisma-subscription-mapper'

type PrismaPaymentDetails = PrismaPayment & {
  subscription: PrismaSubscription | null
  advertisement: PrismaAdvertisementDetails | null
}

export class PrismaPaymentDetailsMapper {
  static toDomain(raw: PrismaPaymentDetails): PaymentDetails {
    return PaymentDetails.create({
      id: new UniqueEntityID(raw.id),
      gateway: raw.gateway,
      checkoutId: raw.checkoutId,
      amount: raw.amount,
      tax: raw.tax,
      status: raw.status,
      link: raw.link,
      method: raw.method,
      pixData: raw.pixData,
      finalCard: raw.finalCard,
      confirmationDate: raw.confirmationDate,
      expiresAt: raw.expiresAt,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      subscription: raw.subscription
        ? PrismaSubscriptionMapper.toDomain(raw.subscription)
        : null,
      advertisement: raw.advertisement
        ? PrismaAdvertisementDetailsMapper.toDomain(raw.advertisement)
        : null,
    })
  }
}
