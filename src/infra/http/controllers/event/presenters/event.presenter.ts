import { Event } from '@/domain/ondehoje/enterprise/entities/event'

export class EventPresenter {
  static toHTTP(raw: Event) {
    return {
      id: raw.id.toString(),
      companyId: raw.companyId.toString(),
      addressId: raw.addressId.toString(),
      categoryId: raw.categoryId.toString(),
      name: raw.name,
      slug: raw.slug.value,
      description: raw.description,
      startDate: raw.startDate,
      endDate: raw.endDate,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }
  }
}
