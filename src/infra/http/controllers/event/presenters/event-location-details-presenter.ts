import { EventDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/event-details'

import { AddressLocationPresenter } from '../../address/presenters/address-location-presenter'

export class EventLocationDetailsPresenter {
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
      address: AddressLocationPresenter.toHTTP(raw.address),
      category: {
        name: raw.category.name,
      },
      company: {
        name: raw.company.name,
      },
      images: raw.images.map(
        (image) => `${process.env.AWS_BUCKET_PUBLIC_URL}/${image.url}`,
      ),
      isFavorited: raw.isFavorited,
    }
  }
}
