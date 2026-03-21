import { Information } from '@/domain/ondehoje/enterprise/entities/information'

export class InformationPresenter {
  static toHTTP(raw: Information) {
    return {
      id: raw.id.toString(),
      companyId: raw.companyId?.toString() || null,
      eventId: raw.eventId?.toString() || null,
      name: raw.name,
      description: raw.description || null,
      phoneNumber: raw.phoneNumber || null,
      email: raw.email || null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }
  }
}
