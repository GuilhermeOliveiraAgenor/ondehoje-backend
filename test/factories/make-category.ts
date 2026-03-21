import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Category,
  CategoryProps,
} from '@/domain/ondehoje/enterprise/entities/category'
import { PrismaCategoryMapper } from '@/infra/database/prisma/mappers/prisma-category-mapper'
import type { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeCategory(
  override: Partial<Category> = {},
  id?: UniqueEntityID,
) {
  const company = Category.create(
    {
      name: faker.person.fullName(),
      description: faker.finance.currencyName(),
      createdBy: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return company
}

@Injectable()
export class CategoryFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCategory(
    data: Partial<CategoryProps> = {},
  ): Promise<Category> {
    const category = makeCategory(data)

    await this.prisma.category.create({
      data: PrismaCategoryMapper.toPersistency(category),
    })

    return category
  }
}
