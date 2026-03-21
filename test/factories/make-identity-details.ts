import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { IdentityProvider } from '@/domain/identity-access/application/enums/identity-provider'
import { IdentityDetails } from '@/domain/identity-access/enterprise/entities/value-object/identity-details'

export function makeIdentityDetails(override: Partial<IdentityDetails> = {}) {
  const identityDetails = IdentityDetails.create({
    id: new UniqueEntityID(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    birthDate: new Date(),
    image: faker.image.avatar(),
    provider: IdentityProvider.SYSTEM,
    roles: new Set<string>(),
    permissions: new Set<string>(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...override,
  })

  return identityDetails
}
