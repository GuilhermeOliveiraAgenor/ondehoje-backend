import { WatchedList } from '@/core/entities/watched-list'

import { IdentityRole } from './identity-role'

export class IdentityRoleList extends WatchedList<IdentityRole> {
  compareItems(a: IdentityRole, b: IdentityRole): boolean {
    return a.identityId.equals(b.identityId) && a.roleId.equals(b.roleId)
  }
}
