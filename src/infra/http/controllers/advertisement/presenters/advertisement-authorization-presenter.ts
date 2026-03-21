import { AdvertisementAuthorization } from '@/domain/ondehoje/enterprise/entities/advertisement-authorization'

import { getAdvertisementAuthorizationStatusDescription } from '../utils/get-advertisement-authorization-status-description'

export class AdvertisementAuthorizationPresenter {
  static toHTTP(raw: AdvertisementAuthorization) {
    return {
      id: raw.id.toString(),
      status: getAdvertisementAuthorizationStatusDescription(raw.status),
      decidedAt: raw.decidedAt,
      rejectedReason: raw.rejectedReason,
    }
  }
}
