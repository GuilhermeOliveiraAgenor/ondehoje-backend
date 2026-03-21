import { Permission } from '../../enterprise/entities/permission'

export abstract class PermissionsRepository {
  abstract findById(id: string): Promise<Permission | null>
  abstract findByActionAndEntity(
    action: string,
    entity: string,
  ): Promise<Permission | null>

  abstract create(permission: Permission): Promise<void>
}
