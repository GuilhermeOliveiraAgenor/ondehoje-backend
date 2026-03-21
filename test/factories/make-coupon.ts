import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Coupon } from '@/domain/ondehoje/enterprise/entities/coupon'

export function makeCoupon(
  override: Partial<Coupon> = {},
  id?: UniqueEntityID,
) {
  const coupon = Coupon.create(
    {
      eventId: new UniqueEntityID(),
      name: faker.person.fullName(),
      description: faker.finance.currencyName(),
      expiresAt: new Date(),
      createdBy: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return coupon
}
