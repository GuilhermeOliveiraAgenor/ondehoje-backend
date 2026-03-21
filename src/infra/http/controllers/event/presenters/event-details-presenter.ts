import { EventDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/event-details'

import { AddressPresenter } from '../../address/presenters/address-presenter'
import { CategoryPresenter } from '../../category/presenters/category-presenter'
import { CompanyDetailsPresenter } from '../../company/presenters/company-details.presenter'
import { InformationPresenter } from '../../information/presenters/information-presenter'
import { ImagePresenter } from '../../upload/presenters/image-presenter'

export class EventDetailsPresenter {
  static toHTTP(raw: EventDetails) {
    return {
      id: raw.id.toString(),
      name: raw.name,
      slug: raw.slug.value,
      description: raw.description,
      startDate: raw.startDate,
      endDate: raw.endDate,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      company: CompanyDetailsPresenter.toHTTP(raw.company),
      address: AddressPresenter.toHTTP(raw.address),
      category: CategoryPresenter.toHTTP(raw.category),
      informations: raw.informations.map((information) =>
        InformationPresenter.toHTTP(information),
      ),
      images: raw.images.map((image) => ImagePresenter.toHTTP(image)),
      isFavorited: raw.isFavorited,
    }
  }
}
