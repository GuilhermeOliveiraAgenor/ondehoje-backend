import { RolePermission } from '../../enterprise/entities/role-permission'

export abstract class RolesPermissionsRepository {
  abstract createMany(relations: RolePermission[]): Promise<void>
  abstract deleteMany(relations: RolePermission[]): Promise<void>
}
