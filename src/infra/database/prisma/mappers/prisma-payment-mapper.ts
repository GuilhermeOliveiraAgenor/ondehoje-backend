import { Payment as PrismaPayment, Prisma } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Payment } from '@/domain/payment/enterprise/entities/payment'

export class PrismaPaymentMapper {
  static toDomain(raw: PrismaPayment): Payment {
    return Payment.create(
      {
        subscriptionId: raw.subscriptionId
          ? new UniqueEntityID(raw.subscriptionId)
          : null,
        advertisementId: raw.advertisementId
          ? new UniqueEntityID(raw.advertisementId)
          : null,
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
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistency(raw: Payment): Prisma.PaymentUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      subscriptionId: raw.subscriptionId?.toString(),
      advertisementId: raw.advertisementId?.toString(),
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
    }
  }
}
