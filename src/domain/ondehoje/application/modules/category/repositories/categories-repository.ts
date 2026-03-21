import { Category } from '@/domain/ondehoje/enterprise/entities/category'

export abstract class CategoriesRepository {
  abstract findById(id: string): Promise<Category | null>
  abstract findByName(name: string): Promise<Category | null>
  abstract findMany(): Promise<Category[]>
  abstract create(category: Category): Promise<void>
  abstract save(category: Category): Promise<void>
}
