import { IdentityRole } from '../../enterprise/entities/identity-role'

export abstract class IdentitiesRolesRepository {
  abstract findManyByIdentityId(identityId: string): Promise<IdentityRole[]>
  abstract createMany(relations: IdentityRole[]): Promise<void>
  abstract deleteMany(relations: IdentityRole[]): Promise<void>
}
