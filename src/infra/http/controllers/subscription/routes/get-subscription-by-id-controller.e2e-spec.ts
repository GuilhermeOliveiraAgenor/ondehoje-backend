import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AddressFactory } from 'test/factories/make-address'
import { ClientFactory } from 'test/factories/make-client'
import { CompanyFactory } from 'test/factories/make-company'
import { SubscriptionFactory } from 'test/factories/make-subscription'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Get Subscription By Id Use Case', () => {
  let app: INestApplication
  let prisma: PrismaService
  let clientFactory: ClientFactory
  let companyFactory: CompanyFactory
  let addressFactory: AddressFactory
  let subscriptionFactory: SubscriptionFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        ClientFactory,
        SubscriptionFactory,
        CompanyFactory,
        AddressFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    clientFactory = moduleRef.get(ClientFactory)
    subscriptionFactory = moduleRef.get(SubscriptionFactory)
    addressFactory = moduleRef.get(AddressFactory)
    companyFactory = moduleRef.get(CompanyFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /subscription/:id', async () => {
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
      createdBy: new UniqueEntityID(client.id.toString()),
      status: 'ACTIVE',
    })

    const subscription = await subscriptionFactory.makePrismaSubscription({
      createdBy: new UniqueEntityID(client.id.toString()),
      companyId: new UniqueEntityID(company.id.toString()),
    })
    const response = await request(app.getHttpServer())
      .get(`/subscriptions/${subscription.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(200)

    const subscriptionOnDatabase = await prisma.subscription.findFirst({
      where: {
        id: subscription.id.toString(),
      },
    })
    expect(subscriptionOnDatabase).toBeTruthy()
  })
})
