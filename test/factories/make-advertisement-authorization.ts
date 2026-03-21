import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AdvertisementStatus } from '@/domain/ondehoje/application/modules/advertisement/enums/advertisement-status'
import {
  AdvertisementAuthorization,
  AdvertisementAuthorizationProps,
} from '@/domain/ondehoje/enterprise/entities/advertisement-authorization'

export function makeAdvertisementAuthorization(
  override: Partial<AdvertisementAuthorizationProps> = {},
  id?: UniqueEntityID,
) {
  const advertisementAuthorization = AdvertisementAuthorization.create(
    {
      advertisementId: new UniqueEntityID(),
      status: AdvertisementStatus.ACTIVE,
      decidedBy: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return advertisementAuthorization
}
