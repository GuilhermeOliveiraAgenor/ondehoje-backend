import { AdvertisementDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/advertisement-details'

import { CompanyPresenter } from '../../company/presenters/company.presenter'
import { EventPresenter } from '../../event/presenters/event.presenter'
import { getAdvertisementStatusDescription } from '../utils/get-advertisement-status-description'
import { AdvertisementAuthorizationPresenter } from './advertisement-authorization-presenter'

export class AdvertisementDetailsPresenter {
  static toHTTP(raw: AdvertisementDetails) {
    return {
      id: raw.id.toString(),
      company: CompanyPresenter.toHTTP(raw.company),
      event: raw.event ? EventPresenter.toHTTP(raw.event) : null,
      description: raw.description,
      days: raw.days,
      amount: raw.amount / 100,
      clicks: raw.clicks,
      insights: raw.insights,
      status: getAdvertisementStatusDescription(raw.status),
      expirationDate: raw.expirationDate,
      advertisementAuthorizations: raw.advertisementAuthorizations.map(
        (authorization) =>
          AdvertisementAuthorizationPresenter.toHTTP(authorization),
      ),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }
  }
}
