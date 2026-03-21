import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Information,
  InformationProps,
} from '@/domain/ondehoje/enterprise/entities/information'
import { PrismaInformationMapper } from '@/infra/database/prisma/mappers/prisma-information-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeInformation(
  override: Partial<Information> = {},
  id?: UniqueEntityID,
) {
  const information = Information.create(
    {
      name: faker.person.fullName(),
      description: faker.finance.currencyName(),
      phoneNumber: faker.finance.accountNumber(),
      email: faker.internet.email(),
      companyId: new UniqueEntityID(),
      eventId: null,
      createdBy: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return information
}

@Injectable()
export class InformationFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaInformation(
    data: Partial<InformationProps> = {},
  ): Promise<Information> {
    const information = makeInformation(data)

    await this.prisma.information.create({
      data: PrismaInformationMapper.toPersistency(information),
    })

    return information
  }
}
