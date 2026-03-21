import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Identity } from '@/domain/identity-access/enterprise/entities/identity'

export function makeIdentity(
  override: Partial<Identity> = {},
  id: UniqueEntityID,
) {
  const identity = Identity.create(override, id)

  return identity
}
