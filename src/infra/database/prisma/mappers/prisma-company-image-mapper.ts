import { CompanyImage as PrismaCompanyImage, type Prisma } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CompanyImage } from '@/domain/ondehoje/enterprise/entities/company-image'

export class PrismaCompanyImageMapper {
  static toDomain(raw: PrismaCompanyImage): CompanyImage {
    return CompanyImage.create({
      companyId: new UniqueEntityID(raw.companyId),
      imageId: new UniqueEntityID(raw.imageId),
    })
  }

  static toPersistencyMany(
    raw: CompanyImage[],
  ): Prisma.CompanyImageCreateManyArgs {
    return {
      data: raw.map((raw) => ({
        companyId: raw.companyId.toString(),
        imageId: raw.imageId.toString(),
      })),
      skipDuplicates: true,
    }
  }
}
