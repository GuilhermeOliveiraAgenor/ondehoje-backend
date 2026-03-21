import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AddressFactory } from 'test/factories/make-address'
import { ClientFactory } from 'test/factories/make-client'
import { CompanyFactory } from 'test/factories/make-company'
import { EventFactory } from 'test/factories/make-event'
import { InformationFactory } from 'test/factories/make-information'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Edit Information Controller (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let clientFactory: ClientFactory
  let companyFactory: CompanyFactory
  let addressFactory: AddressFactory
  let eventFactory: EventFactory
  let informationFactory: InformationFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        ClientFactory,
        InformationFactory,
        CompanyFactory,
        AddressFactory,
        EventFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    clientFactory = moduleRef.get(ClientFactory)
    companyFactory = moduleRef.get(CompanyFactory)
    addressFactory = moduleRef.get(AddressFactory)
    eventFactory = moduleRef.get(EventFactory)
    informationFactory = moduleRef.get(InformationFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /information', async () => {
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

    const category = await prisma.category.create({
      data: {
        name: 'Categoria iuiuiiu',
        description: 'Descrição',
        createdBy: client.id.toString(),
      },
    })

    const event = await eventFactory.makePrismaEvent({
      companyId: new UniqueEntityID(company.id.toString()),
      addressId: new UniqueEntityID(address.id.toString()),
      categoryId: new UniqueEntityID(category.id.toString()),
      createdBy: new UniqueEntityID(client.id.toString()),
    })

    const information = await informationFactory.makePrismaInformation({
      eventId: new UniqueEntityID(event.id.toString()),
      companyId: new UniqueEntityID(company.id.toString()),
      createdBy: new UniqueEntityID(client.id.toString()),
    })

    const response = await request(app.getHttpServer())
      .put(`/informations/${information.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Lista',
        description: 'Informações',
        phoneNumber: '9889789',
        email: 'iuioiuouio',
        informationId: information.id.toString(),
      })

    expect(response.statusCode).toBe(200)

    const informationOnDatabase = await prisma.information.findUnique({
      where: {
        id: information.id.toString(),
      },
    })

    expect(informationOnDatabase).not.toBeNull()
    expect(informationOnDatabase).toMatchObject({
      name: 'Lista',
      description: 'Informações',
    })
  })
})
