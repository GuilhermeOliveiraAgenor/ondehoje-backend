import { Category } from '@/domain/ondehoje/enterprise/entities/category'

export class CategoryPresenter {
  static toHTTP(raw: Category) {
    return {
      id: raw.id.toString(),
      name: raw.name,
      description: raw.description,
      createdAt: raw.createdAt,
      createdBy: raw.createdBy.toString(),
      updatedAt: raw.updatedAt,
      updatedBy: raw.updatedBy?.toString() || null,
    }
  }
}
