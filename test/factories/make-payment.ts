import { randomUUID } from 'node:crypto'

import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PaymentProvider } from '@/domain/payment/application/enums/payment-provider'
import {
  Payment,
  PaymentProps,
} from '@/domain/payment/enterprise/entities/payment'

export function makePayment(
  override: Partial<PaymentProps> = {},
  id?: UniqueEntityID,
) {
  const payment = Payment.create(
    {
      gateway: PaymentProvider.STRIPE,
      checkoutId: randomUUID(),
      amount: Number(faker.commerce.price()),
      tax: 0,
      status: 'pending',
      link: faker.internet.url(),
      method: 'credit_card',
      expiresAt: faker.date.soon({
        days: 2,
      }),
      ...override,
    },
    id,
  )

  return payment
}
