import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { IdentityRole } from '@/domain/identity-access/enterprise/entities/identity-role'

export function makeIdentityRole(
  override: Partial<IdentityRole> = {},
  id?: UniqueEntityID,
) {
  const identityRole = IdentityRole.create(
    {
      roleId: new UniqueEntityID(),
      identityId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return identityRole
}
