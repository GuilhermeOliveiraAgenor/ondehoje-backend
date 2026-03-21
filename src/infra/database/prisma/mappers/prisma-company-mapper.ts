import { Company as PrismaCompany, Prisma } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Company } from '@/domain/ondehoje/enterprise/entities/company'
import { Slug } from '@/domain/ondehoje/enterprise/entities/value-objects/slug'

export class PrismaCompanyMapper {
  static toDomain(raw: PrismaCompany): Company {
    return Company.create(
      {
        addressId: new UniqueEntityID(raw.addressId),
        name: raw.name,
        slug: Slug.create(raw.slug),
        socialName: raw.socialName,
        status: raw.status,
        document: raw.document,
        createdAt: raw.createdAt,
        createdBy: new UniqueEntityID(raw.createdBy),
        updatedAt: raw.updatedAt,
        updatedBy: raw.updatedBy ? new UniqueEntityID(raw.updatedBy) : null,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistency(raw: Company): Prisma.CompanyUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      addressId: raw.addressId.toString(),
      name: raw.name,
      slug: raw.slug.value,
      socialName: raw.socialName,
      status: raw.status,
      document: raw.document,
      createdAt: raw.createdAt,
      createdBy: raw.createdBy.toString(),
      updatedAt: raw.updatedAt,
      updatedBy: raw.updatedBy ? raw.updatedBy.toString() : null,
    }
  }
}
