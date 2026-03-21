import { CategoriesRepository } from '@/domain/ondehoje/application/modules/category/repositories/categories-repository'
import { Category } from '@/domain/ondehoje/enterprise/entities/category'

export class InMemoryCategoriesRepository implements CategoriesRepository {
  public items: Category[] = []

  async findById(id: string): Promise<Category | null> {
    const category = this.items.find((item) => item.id.toString() === id)

    if (!category) {
      return null
    }

    return category
  }

  async findByName(name: string): Promise<Category | null> {
    const category = this.items.find((item) => item.name === name)

    if (!category) {
      return null
    }

    return category
  }

  async findMany(): Promise<Category[]> {
    return this.items
  }

  async create(category: Category): Promise<void> {
    this.items.push(category)
  }

  async save(category: Category): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === category.id)

    this.items[itemIndex] = category
  }
}
