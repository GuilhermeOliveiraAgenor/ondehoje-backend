import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CompanyStatus } from '@/domain/ondehoje/application/modules/company/enums/company-status'
import {
  Company,
  CompanyProps,
} from '@/domain/ondehoje/enterprise/entities/company'
import { PrismaCompanyMapper } from '@/infra/database/prisma/mappers/prisma-company-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeCompany(
  override: Partial<Company> = {},
  id?: UniqueEntityID,
) {
  const company = Company.create(
    {
      addressId: new UniqueEntityID(),
      document: faker.internet.ip(),
      name: faker.company.name(),
      socialName: faker.company.buzzAdjective(),
      status: CompanyStatus.ACTIVE,
      createdBy: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return company
}

@Injectable()
export class CompanyFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCompany(data: Partial<CompanyProps> = {}): Promise<Company> {
    const company = makeCompany(data)

    await this.prisma.company.create({
      data: PrismaCompanyMapper.toPersistency(company),
    })

    return company
  }
}
