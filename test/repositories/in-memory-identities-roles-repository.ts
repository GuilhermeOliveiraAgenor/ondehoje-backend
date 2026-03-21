import { IdentitiesRolesRepository } from '@/domain/identity-access/application/repositories/identities-roles-repository'
import { IdentityRole } from '@/domain/identity-access/enterprise/entities/identity-role'

export class InMemoryIdentitiesRolesRepository
  implements IdentitiesRolesRepository
{
  public items: IdentityRole[] = []

  async findManyByIdentityId(identityId: string): Promise<IdentityRole[]> {
    const identityRoles = this.items.filter(
      (item) => item.identityId.toString() === identityId,
    )

    return identityRoles
  }

  async createMany(relations: IdentityRole[]): Promise<void> {
    this.items.push(...relations)
  }

  async deleteMany(relations: IdentityRole[]): Promise<void> {
    const identityRoles = this.items.filter((item) => {
      return !relations.some((identityRole) => identityRole.equals(item))
    })

    this.items = identityRoles
  }
}
