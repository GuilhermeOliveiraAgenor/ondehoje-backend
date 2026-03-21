import { Company } from '@/domain/ondehoje/enterprise/entities/company'

import { getCompanyStatusDescription } from '../utils/get-company-status-description'

export class CompanyPresenter {
  static toHTTP(raw: Company) {
    return {
      id: raw.id.toString(),
      addressId: raw.addressId.toString(),
      name: raw.name,
      socialName: raw.socialName,
      slug: raw.slug.value,
      status: getCompanyStatusDescription(raw.status),
      document: raw.document,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }
  }
}
