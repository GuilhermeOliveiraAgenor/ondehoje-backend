import { AdvertisementAuthorizationStatus } from '@/domain/ondehoje/application/modules/advertisement-authorization/enums/advertisement-authorization-status'

export function getAdvertisementAuthorizationStatusDescription(
  status: string,
): string {
  const keys = {
    [AdvertisementAuthorizationStatus.AUTHORIZED]: 'Autorizado',
    [AdvertisementAuthorizationStatus.NOT_AUTHORIZED]: 'Não autorizado',
  }

  const key = keys[status]

  return key
}
