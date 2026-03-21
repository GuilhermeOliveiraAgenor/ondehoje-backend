import { CompanyImage } from '@/domain/ondehoje/enterprise/entities/company-image'

export class CompanyImagePresenter {
  static toHTTP(raw: CompanyImage) {
    return {
      id: raw.id.toString(),
      companyId: raw.companyId.toString(),
      imageId: raw.imageId.toString(),
    }
  }
}
