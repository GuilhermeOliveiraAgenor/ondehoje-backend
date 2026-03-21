import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Role } from '@/domain/identity-access/enterprise/entities/role'

export function makeRole(override: Partial<Role> = {}, id?: UniqueEntityID) {
  const role = Role.create(
    {
      name: faker.lorem.words(2),
      ...override,
    },
    id,
  )

  return role
}
