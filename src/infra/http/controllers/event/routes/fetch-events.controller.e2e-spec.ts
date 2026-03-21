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
      name: `Nutrosul ${faker.string.alphanumeric(5)}`,
      socialName: 'Nutrosul',
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
        name: 'Categoria Nutrosul',
        description: 'Descrição',
        createdBy: client.id.toString(),
      },
    })

    const image = await imageFactory.makePrismaImage()

    const eventResponse = await request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        companyId: company.id.toString(),
        addressId: address.id.toString(),
        categoryId: category.id.toString(),
        name: 'Evento Fetch',
        description: 'Descrição do evento',
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        imageIds: [image.id.toString()],
        informations: [
          {
            name: 'Info 1',
            description: 'Info descrição',
            phoneNumber: '12345678',
            email: 'teste@email.com',
            createdBy: client.id.toString(),
          },
        ],
      })

    expect(eventResponse.status).toBe(201)

    const eventOnDatabase = await prisma.event.findFirst({
      where: { name: 'Evento Fetch' },
    })
    expect(eventOnDatabase).toBeTruthy()
  })
})
