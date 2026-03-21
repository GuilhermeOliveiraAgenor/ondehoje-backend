import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AdvertisementType } from '@/domain/ondehoje/enterprise/entities/advertisement-type'

export function makeAdvertisementType(
  override: Partial<AdvertisementType> = {},
  id?: UniqueEntityID,
) {
  const advertisementType = AdvertisementType.create(
    {
      name: faker.person.fullName(),
      description: faker.finance.currencyName(),
      days: faker.number.int(),
      value: faker.number.float(),
      createdBy: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return advertisementType
}
