import { randomUUID } from 'node:crypto'

import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ParameterType } from '@/domain/ondehoje/application/modules/parameter/enums/parameter-type'
import {
  Parameter,
  ParameterProps,
} from '@/domain/ondehoje/enterprise/entities/parameter'

export function makeParameter(
  override: Partial<ParameterProps> = {},
  id?: UniqueEntityID,
) {
  const parameter = Parameter.create(
    {
      key: faker.lorem.word(),
      keyInfo: faker.lorem.sentence(),
      type: ParameterType.VALUE,
      status: true,
      visible: true,
      value: faker.lorem.words(3),
      createdBy: new UniqueEntityID(randomUUID()),
      ...override,
    },
    id,
  )

  return parameter
}
