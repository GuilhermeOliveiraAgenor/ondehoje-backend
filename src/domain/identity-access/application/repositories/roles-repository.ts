import { Role } from '../../enterprise/entities/role'

export abstract class RolesRepository {
  abstract findById(id: string): Promise<Role | null>
  abstract findByName(name: string): Promise<Role | null>
  abstract create(role: Role): Promise<void>
  abstract save(role: Role): Promise<void>
}
