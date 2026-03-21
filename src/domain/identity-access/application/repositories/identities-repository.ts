import { Identity } from '../../enterprise/entities/identity'
import { IdentityDetails } from '../../enterprise/entities/value-object/identity-details'

export abstract class IdentitiesRepository {
  abstract findById(id: string): Promise<Identity | null>
  abstract findIdentityDetailsById(id: string): Promise<IdentityDetails | null>
  abstract findManyWithPermission(
    action: string,
    entity: string,
  ): Promise<IdentityDetails[]>

  abstract create(identity: Identity): Promise<void>
  abstract save(identity: Identity): Promise<void>
}
