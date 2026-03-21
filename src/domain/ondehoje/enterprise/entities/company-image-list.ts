import { WatchedList } from '@/core/entities/watched-list'

import { CompanyImage } from './company-image'

export class CompanyImageList extends WatchedList<CompanyImage> {
  compareItems(a: CompanyImage, b: CompanyImage): boolean {
    return a.companyId.equals(b.companyId) && a.imageId.equals(b.imageId)
  }
}
