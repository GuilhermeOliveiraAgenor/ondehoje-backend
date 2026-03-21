import { Injectable } from '@nestjs/common'

import { CategoriesRepository } from '@/domain/ondehoje/application/modules/category/repositories/categories-repository'
import { Category } from '@/domain/ondehoje/enterprise/entities/category'

import { PrismaCategoryMapper } from '../mappers/prisma-category-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaCategoriesRepository implements CategoriesRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Category | null> {
    const [category] = await this.prisma.$transaction([
      this.prisma.category.findUnique({
        where: {
          id,
        },
      }),
    ])

    if (!category) {
      return null
    }

    return PrismaCategoryMapper.toDomain(category)
  }

  async findByName(name: string): Promise<Category | null> {
    const [category] = await this.prisma.$transaction([
      this.prisma.category.findUnique({
        where: {
          name,
        },
      }),
    ])

    if (!category) {
      return null
    }

    return PrismaCategoryMapper.toDomain(category)
  }

  async findMany(): Promise<Category[]> {
    const [categories] = await this.prisma.$transaction([
      this.prisma.category.findMany(),
    ])

    return categories.map(PrismaCategoryMapper.toDomain)
  }

  async create(category: Category): Promise<void> {
    const data = PrismaCategoryMapper.toPersistency(category)

    await this.prisma.$transaction([
      this.prisma.category.create({
        data,
      }),
    ])
  }

  async save(category: Category): Promise<void> {
    const data = PrismaCategoryMapper.toPersistency(category)

    await this.prisma.$transaction([
      this.prisma.category.update({
        where: {
          id: category.id.toString(),
        },
        data,
      }),
    ])
  }
}
