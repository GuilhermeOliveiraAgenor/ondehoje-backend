import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AddressFactory } from 'test/factories/make-address'
import { ClientFactory } from 'test/factories/make-client'
import { CompanyFactory } from 'test/factories/make-company'
import { EventFactory } from 'test/factories/make-event'
import { EventImageFactory } from 'test/factories/make-event-image'
import { ImageFactory } from 'test/factories/make-image'
import { InformationFactory } from 'test/factories/make-information'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CompanyStatus } from '@/domain/ondehoje/application/modules/company/enums/company-status'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Fetch Event Controller (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let clientFactory: ClientFactory
  let companyFactory: CompanyFactory
  let addressFactory: AddressFactory
  let eventFactory: EventFactory
  let imageFactory: ImageFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        ClientFactory,
        CompanyFactory,
        AddressFactory,
        InformationFactory,
        ImageFactory,
        EventFactory,
        EventImageFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    clientFactory = moduleRef.get(ClientFactory)
    companyFactory = moduleRef.get(CompanyFactory)
    addressFactory = moduleRef.get(AddressFactory)
    eventFactory = moduleRef.get(EventFactory)
    imageFactory = moduleRef.get(ImageFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /event', async () => {
    const client = await clientFactory.makePrismaClient()
    const accessToken = jwt.sign({
      sub: client.id.toString(),
      email: client.email,
    })

    const address = await addressFactory.makePrismaAddress({
      createdBy: new UniqueEntityID(client.id.toString()),
    })

    const company = await companyFactory.makePrismaCompany({
      addressId: address.id,
      name: `Vedapar ${faker.string.alphanumeric(5)}`,
      socialName: 'Vedapar',
      document: faker.string.numeric(9),
      createdBy: new UniqueEntityID(client.id.toString()),
      status: 'ACTIVE',
    })

    await prisma.subscription.create({
      data: {
        companyId: company.id.toString(),
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        status: CompanyStatus.ACTIVE,
        amount: 0,
        createdBy: client.id.toString(),
        updatedBy: client.id.toString(),
      },
    })

    const category = await prisma.category.create({
      data: {
        name: 'Categoria iuioiuoiuo',
        description: 'Descrição',
        createdBy: client.id.toString(),
      },
    })

    await imageFactory.makePrismaImage()

    await eventFactory.makePrismaEvent({
      companyId: company.id,
      categoryId: new UniqueEntityID(category.id),
      addressId: address.id,
      createdBy: new UniqueEntityID(client.id.toString()),
    })

    await eventFactory.makePrismaEvent({
      companyId: company.id,
      categoryId: new UniqueEntityID(category.id),
      addressId: address.id,
      createdBy: new UniqueEntityID(client.id.toString()),
    })

    const eventResponse = await request(app.getHttpServer())
      .get(`/events/company/${company.slug}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(eventResponse.status).toBe(200)

    const eventOnDatabase = await prisma.event.findMany({
      where: {
        companyId: company.id.toString(),
      },
    })

    expect(eventOnDatabase).toBeTruthy()
    expect(eventOnDatabase.length).toBeGreaterThan(0)
  })
})
