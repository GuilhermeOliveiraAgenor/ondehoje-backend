import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Permission } from '@/domain/identity-access/enterprise/entities/permission'

export function makePermission(
  override: Partial<Permission> = {},
  id?: UniqueEntityID,
) {
  const permission = Permission.create(
    {
      action: faker.lorem.word(),
      entity: faker.lorem.word(),
      ...override,
    },
    id,
  )

  return permission
}
