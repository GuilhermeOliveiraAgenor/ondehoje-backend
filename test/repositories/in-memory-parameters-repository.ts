import type { ParametersRepository } from '@/domain/ondehoje/application/modules/parameter/repositories/parameters-repository'
import type { Parameter } from '@/domain/ondehoje/enterprise/entities/parameter'

export class InMemoryParametersRepository implements ParametersRepository {
  public items: Parameter[] = []

  async findById(id: string): Promise<Parameter | null> {
    const parameter = this.items.find((item) => item.id.toString() === id)

    if (!parameter) {
      return null
    }

    return parameter
  }

  async findByKey(key: string): Promise<Parameter | null> {
    const parameter = this.items.find((item) => item.key === key)

    if (!parameter) {
      return null
    }

    return parameter
  }

  async findMany(): Promise<Parameter[]> {
    return this.items
  }

  async create(parameter: Parameter): Promise<void> {
    this.items.push(parameter)
  }

  async save(parameter: Parameter): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === parameter.id)

    this.items[itemIndex] = parameter
  }
}
