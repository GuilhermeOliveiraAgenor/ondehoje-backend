import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  CompanyImage,
  CompanyImageProps,
} from '@/domain/ondehoje/enterprise/entities/company-image'
import { PrismaCompanyImageMapper } from '@/infra/database/prisma/mappers/prisma-company-image-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeCompanyImage(
  override: Partial<CompanyImage> = {},
  id?: UniqueEntityID,
) {
  const companyImage = CompanyImage.create(
    {
      imageId: new UniqueEntityID(),
      companyId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return companyImage
}

@Injectable()
export class CompanyImageFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCompanyImage(
    data: Partial<CompanyImageProps> = {},
  ): Promise<CompanyImage> {
    const companyImage = makeCompanyImage(data)

    await this.prisma.companyImage.createMany(
      PrismaCompanyImageMapper.toPersistencyMany([companyImage]),
    )

    return companyImage
  }
}
