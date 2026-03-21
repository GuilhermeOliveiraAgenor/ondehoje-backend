import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Advertisement,
  AdvertisementProps,
} from '@/domain/ondehoje/enterprise/entities/advertisement'

export function makeAdvertisement(
  override: Partial<AdvertisementProps> = {},
  id?: UniqueEntityID,
) {
  const advertisement = Advertisement.create(
    {
      companyId: new UniqueEntityID(),
      days: Math.random() * 30,
      description: faker.lorem.sentence(),
      amount: Math.random() * 100,
      expirationDate: faker.date.soon(),
      createdBy: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return advertisement
}
