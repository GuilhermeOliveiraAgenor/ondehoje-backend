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

describe('Edit Event Controller (e2e)', () => {
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
  test('[PUT] /event', async () => {
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
      name: `Cia Verde ${faker.string.alphanumeric(5)}`,
      socialName: 'Cia Verde',
      document: faker.string.numeric(9),
      createdBy: new UniqueEntityID(client.id.toString()),
      status: 'ACTIVE',
    })

    await prisma.subscription.create({
      data: {
        companyId: company.id.toString(),
        amount: 5000,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        status: CompanyStatus.ACTIVE,
        createdBy: client.id.toString(),
        updatedBy: client.id.toString(),
      },
    })

    const category = await prisma.category.create({
      data: {
        name: 'Categoria iououiiou',
        description: 'Descrição',
        createdBy: client.id.toString(),
      },
    })

    const image = await imageFactory.makePrismaImage()

    const event = await eventFactory.makePrismaEvent({
      companyId: company.id,
      categoryId: new UniqueEntityID(category.id),
      addressId: address.id,
      createdBy: new UniqueEntityID(client.id.toString()),
    })

    const eventResponse = await request(app.getHttpServer())
      .put(`/events/${event.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        eventId: event.id.toString(),
        addressId: address.id.toString(),
        categoryId: category.id.toString(),
        name: 'Evento Cia Verde',
        description: 'Descrição iuoi',
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        imagesIds: [image.id.toString()],
      })

    expect(eventResponse.status).toBe(200)

    const eventOnDatabase = await prisma.event.findFirst({
      where: { id: event.id.toString() },
    })
    expect(eventOnDatabase).toBeTruthy()
    expect(eventOnDatabase).toMatchObject({
      name: 'Evento Cia Verde',
    })
  })
})
